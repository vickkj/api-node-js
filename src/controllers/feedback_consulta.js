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
            const id_feedback = request.params.fdbk_id; // vindo da URL
            const { comentario } = request.body;        // vindo do corpo da requisição
    
            if (!comentario) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O campo "comentario" é obrigatório.',
                    dados: null
                });
            }
    
            const [resultado] = await db.query(`
                UPDATE feedback_consulta
                SET fdbk_mensagem = ?
                WHERE fdbk_id = ?
            `, [comentario, id_feedback]);
    
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
                dados: { fdbk_id: id_feedback, comentario }
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
            const id_feedback = request.params.fdbk_id;
    
            if (!id_feedback) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'O ID do feedback não foi informado.',
                    dados: null
                });
            }
    
            const comandoSQL = `DELETE FROM feedback_consulta WHERE fdbk_id = ?;`;
            const [resultado] = await db.query(comandoSQL, [id_feedback]);
    
            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Feedback com ID ${id_feedback} não encontrado.`,
                    dados: null
                });
            }
    
            return response.status(200).json({
                sucesso: true,
                mensagem: `Feedback com ID ${id_feedback} excluído com sucesso.`,
                dados: null
            });
    
        } catch (erro) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao excluir o feedback.',
                dados: erro.message
            });
        }
    },
    
    async ocultarFeedback_consulta(request, response) {
        try {
            const id_feedback = request.params.fdbk_id;
    
            if (!id_feedback) {
                return response.status(400).json({
                    sucesso: false,
                    mensagem: 'ID do feedback não informado.',
                    dados: null
                });
            }
    
            const [resultado] = await db.query(`
                UPDATE feedback_consulta
                SET fdbk_ativo = false
                WHERE fdbk_id = ?;
            `, [id_feedback]);
    
            if (resultado.affectedRows === 0) {
                return response.status(404).json({
                    sucesso: false,
                    mensagem: `Feedback com ID ${id_feedback} não encontrado.`,
                    dados: null
                });
            }
    
            return response.status(200).json({
                sucesso: true,
                mensagem: `Feedback com ID ${id_feedback} foi ocultado com sucesso.`,
                dados: null
            });
    
        } catch (erro) {
            return response.status(500).json({
                sucesso: false,
                mensagem: 'Erro ao ocultar o feedback.',
                dados: erro.message
            });
        }
    }
    

};
