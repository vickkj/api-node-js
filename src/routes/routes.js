const express = require('express');
const router = express.Router();

const FeedbackConsulta = require('../controllers/feedback_consulta');

router.get('/feedback-consulta', FeedbackConsulta.listarFeedback_consulta);
router.post('/feedback-consulta', FeedbackConsulta.cadastrarFeedback_consulta);
router.patch('/feedback-consulta/:fdbk_mensagem', FeedbackConsulta.editarFeedback_consulta);
router.delete('/feedback-consulta', FeedbackConsulta.apagarFeedback_consulta);

module.exports = router;
