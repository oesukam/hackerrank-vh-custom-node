const db = require('../db');

const getAllEvents = (req, res) => {};

const addEvent = async (req, res) => {
  const { body } = req;
  const foundEvent = await db.get('SELECT id from events WHERE id = ?', [
    body.id
  ]);

  if (foundEvent) {
    return res.status(400).json({
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

  return res.status(201).json(body);
};

const getByActor = (req, res) => {};

const eraseEvents = (req, res) => {};

module.exports = {
  getAllEvents: getAllEvents,
  addEvent: addEvent,
  getByActor: getByActor,
  eraseEvents: eraseEvents
};
