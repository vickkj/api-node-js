const db = require('../database/connection');

module.exports = {
    async listarFeedback_consulta(request, response) {
        try {
            const [resultados] = await db.query(`
                SELECT 
                    id,
                    paciente_id,
                    psicologo_id,
                    nota_estrelas,
                    comentario,
                    data_feedback
                FROM feedback_consultas
                ORDER BY data_feedback DESC
            `);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de feedback_consulta',
                dados: resultados
            });
        } catch (error) {
            console.error("Erro ao listar feedback:", error);
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro na requisição.',
                dados: error.message
            });
        }
    },

    // Os outros métodos seguem depois...
};
