const express = require('express');
const router = express.Router();

const FeedbackConsulta = require('../controllers/feedback_consulta');

router.get('/feedback-consulta', FeedbackConsulta.listarFeedback_consulta);
router.post('/feedback-consulta', FeedbackConsulta.cadastrarFeedback_consulta);
router.patch('/feedback-consulta/:fdbk_id', FeedbackConsulta.editarFeedback_consulta);
router.delete('/feedback-consulta/:fdbk_id', FeedbackConsulta.apagarFeedback_consulta);
router.delete('/feedback-consulta/:fdbk_id', FeedbackConsulta.ocultarFeedback_consulta);

module.exports = router;
