const db = require('../db');
const statusCodes = require('../constants/statusCodes');

const getAllActors = async (req, res) => {
  let result = await db.all(`
    SELECT actors.*, COUNT(events.id) total_events, events.created_at FROM actors
    INNER JOIN events ON events.actor_id = actors.id
    GROUP BY actors.id
    ORDER BY total_events DESC, created_at DESC, login DESC;
	`);

  result = result.map(item => {
    delete item.total_events;
    delete item.created_at;
    return item;
  });

  return res.json(result);
};

const updateActor = (req, res) => {};

const getStreak = (req, res) => {};

module.exports = {
  updateActor: updateActor,
  getAllActors: getAllActors,
  getStreak: getStreak
};
