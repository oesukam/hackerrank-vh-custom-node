const db = require('../db');
const statusCodes = require('../constants/statusCodes');

const getAllEvents = async (req, res) => {
  const result = await db.all(`
		SELECT 
			events.*,
			actors.login,
			actors.avatar_url,
			repos.name,
			repos.url
		FROM events
		INNER JOIN actors on events.actor_id = actors.id
    INNER JOIN repos on events.repo_id = repos.id
    ORDER BY events.id ASC
	`);

  const data = [];
  result.forEach(row => {
    const column = {
      id: row.id,
      type: row.type
    };
    if (row.actor_id) {
      column.actor = {
        id: row.actor_id,
        login: row.login,
        avatar_url: row.avatar_url
      };
    }
    if (row.repo_id) {
      column.repo = {
        id: row.repo_id,
        name: row.name,
        url: row.url
      };
    }
    column.created_at = row.created_at;
    data.push(column);
  });
  return res.json(data);
};

const addEvent = async (req, res) => {
  const { body } = req;
  const foundEvent = await db.get('SELECT id from events WHERE id = ?', [
    body.id
  ]);

  if (foundEvent) {
    return res.status(statusCodes.BAD_REQUEST).json({
      error: 'Event already exists'
    });
  }

  const foundActor = await db.get('SELECT * from actors WHERE id = ?', [
    body.actor.id
  ]);

  if (!foundActor) {
    body.actor.login = foundActor ? foundActor.login : body.actor.login;
    body.actor.avatar_url = foundActor
      ? foundActor.avatar_url
      : body.actor.avatar_url;

    await db.run(
      'INSERT INTO actors (id, login, avatar_url) VALUES (?, ?, ?)',
      [body.actor.id, body.actor.login, body.actor.avatar_url]
    );
  }

  const foundRepo = await db.get('SELECT * from repos WHERE id = ?', [
    body.repo.id
  ]);
  if (!foundRepo) {
    body.repo.name = foundRepo ? foundRepo.name : body.repo.name;
    body.repo.url = foundRepo ? foundRepo.url : body.repo.url;

    await db.run('INSERT INTO repos (id, name, url) VALUES (?, ?, ?)', [
      body.repo.id,
      body.repo.name,
      body.repo.url
    ]);
  }

  await db.run(
    'INSERT INTO events (id, type, actor_id, repo_id, created_at) VALUES (?, ?, ?, ?, ?)',
    [body.id, body.type, body.actor.id, body.repo.id, body.created_at]
  );

  return res.status(statusCodes.CREATED).json(body);
};

const getByActor = async (req, res) => {
  const { actorId } = req.params;
  const result = await db.all(
    `
		SELECT 
			events.*,
			actors.login,
			actors.avatar_url,
			repos.name,
			repos.url
		FROM events
		INNER JOIN actors on events.actor_id = actors.id
    INNER JOIN repos on events.repo_id = repos.id
    WHERE actors.id = ? AND events.actor_id = ?
    ORDER BY events.id DESC
	`,
    [actorId, actorId]
  );

  const data = [];
  result.forEach(row => {
    const column = {
      id: row.id,
      type: row.type
    };
    if (row.actor_id) {
      column.actor = {
        id: row.actor_id,
        login: row.login,
        avatar_url: row.avatar_url
      };
    }
    if (row.repo_id) {
      column.repo = {
        id: row.repo_id,
        name: row.name,
        url: row.url
      };
    }
    column.created_at = row.created_at;
    data.push(column);
  });
  return res.json(data);
};

const eraseEvents = async (req, res) => {
  await db.run('DELETE FROM events');
  await db.run('DELETE FROM actors');
  await db.run('DELETE FROM repos');
  return res.json([]);
};

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  getByActor: getByActor,
  eraseEvents: eraseEvents
};
