const db = require('../dataBase/connection');

module.exports = {
    async listarFeedback_consulta(request, response) {
        try {
            const [resultados] = await db.query(`
                SELECT 
                    fdbk_id,
                    psi_id,
                    usu_id,
                    fdbk_mensagem AS comentario,
                    DATE_FORMAT(fdbk_data_hora, '%d/%m/%Y %H:%i') AS data_formatada
                FROM feedback_consulta
                ORDER BY fdbk_data_hora DESC;
            `);

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Lista de feedbacks recuperada com sucesso',
                dados: resultados,
                total: resultados.length
            });
        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao buscar feedbacks',
                dados: error.message
            });
        }
    },

    async cadastrarFeedback_consulta(request, response) {
        try {
            const { psi_id, usu_id, comentario } = request.body;

            if (!psi_id || !usu_id || !comentario) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Campos obrigatórios não informados',
                    dados: null
                });
            }

            const [resultado] = await db.query(`
                INSERT INTO feedback_consulta (psi_id, usu_id, fdbk_mensagem, fdbk_data_hora)
                VALUES (?, ?, ?, NOW());
            `, [psi_id, usu_id, comentario]);

            return response.status(201).json({
                sucesso: true,
                mensagem: 'Feedback cadastrado com sucesso',
                dados: { fdbk_id: resultado.insertId }
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao cadastrar feedback',
                dados: error.message
            });
        }
    },

    async editarFeedback_consulta(request, response) {
        try {
            const { fdbk_id, comentario } = request.body;

            if (!fdbk_id || !comentario) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'Informe o ID do feedback e o novo comentário.',
                    dados: null
                });
            }

            const [resultado] = await db.query(`
                UPDATE feedback_consulta
                SET fdbk_mensagem = ?
                WHERE fdbk_id = ?
            `, [comentario, fdbk_id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Feedback não encontrado para atualização.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Comentário atualizado com sucesso!',
                dados: { fdbk_id, comentario }
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao atualizar o comentário.',
                dados: error.message
            });
        }
    },

    async apagarFeedback_consulta(request, response) {
        try {
            const { fdbk_id } = request.body;

            if (!fdbk_id) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'ID do feedback não informado',
                    dados: null
                });
            }

            const [resultado] = await db.query(`
                DELETE FROM feedback_consulta WHERE fdbk_id = ?
            `, [fdbk_id]);

            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: 'Feedback não encontrado para exclusão.',
                    dados: null
                });
            }

            return response.status(200).json({
                sucesso: true,
                mensagem: 'Feedback excluído com sucesso',
                dados: resultado
            });

        } catch (error) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao excluir feedback',
                dados: error.message
            });
        }
    }
};
