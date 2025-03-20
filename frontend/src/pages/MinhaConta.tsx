import { useState, useEffect, FormEvent } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";
import "../styles/MinhaConta.css";
import useBodyClass from "../hooks/useBodyClass";
import Toast from "../components/Toast";
import EnderecoUsuario from "./EnderecoUsuario";

interface DadosUsuario {
  id: number;
  nome: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  genero: string;
  fotoDePerfil: string | null;
  senha: string;
  confirmarSenha: string;
}

const MinhaConta = () => {
  useBodyClass("dashboard-page");
  const { user, atualizarDadosDoUsuario } = useAuth();
  
  const [dadosUsuario, setDadosUsuario] = useState<DadosUsuario>({
    id: 0,
    nome: "",
    email: "",
    cpf: "",
    dataNascimento: "",
    genero: "",
    fotoDePerfil: null,
    senha: "",
    confirmarSenha: "",
  });
  
  const [edicaoAtiva, setEdicaoAtiva] = useState(false);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });
  const [carregando, setCarregando] = useState(true);
  const [alterandoSenha, setAlterandoSenha] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fotoAlterada, setFotoAlterada] = useState(false);
  const [mostrarNotificacao, setMostrarNotificacao] = useState(false);
  const [showEnderecoModal, setShowEnderecoModal] = useState(false);
  
  
  useEffect(() => {
    const buscarDadosUsuario = async () => {
      if (user?.id) {
        try {
          const response = await api.get(`/usuarios/${user.id}`);
          
        // formatar a data de nascimento para o formato yyyy-mm-dd
          const data = new Date(response.data.dataNascimento);
          const dataFormatada = data.toISOString().split('T')[0];
          
          setDadosUsuario({
            ...response.data,
            id: response.data.id_usuario || user.id,
            dataNascimento: dataFormatada,
            senha: "",
            confirmarSenha: "",
          });
          
          setPreviewImage(response.data.fotoDePerfil);
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
          setMensagem({
            tipo: "erro",
            texto: "Erro ao carregar seus dados. Tente novamente mais tarde."
          });
        } finally {
          setCarregando(false);
        }
      }
    };

    buscarDadosUsuario();
  }, [user?.id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDadosUsuario(prev => ({ ...prev, [name]: value }));
  };
  
  // Função para redimensionar a imagem antes de transformá-la em base64
  const resizeImage = (file: File, maxWidth: number = 250, maxHeight: number = 250): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          let width = img.width;
          let height = img.height;
          
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round(height * maxWidth / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round(width * maxHeight / height);
              height = maxHeight;
            }
          }
          
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          const quality = 0.5;
          const base64 = canvas.toDataURL('image/webp', quality);
          resolve(base64);
        };
      };
    });
  };
  
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        setMensagem({ tipo: "info", texto: "Processando imagem..." });
        
        const base64String = await resizeImage(file);
        
        setPreviewImage(base64String);
        setDadosUsuario(prev => ({ ...prev, fotoDePerfil: base64String }));
        setFotoAlterada(true);
        setMensagem({ tipo: "", texto: "" });
      } catch (error) {
        console.error("Erro ao processar imagem:", error);
        setMensagem({ tipo: "erro", texto: "Não foi possível processar a imagem. Tente outra." });
      }
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    

    if (alterandoSenha && dadosUsuario.senha !== dadosUsuario.confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "As senhas não coincidem." });
      return;
    }
  
    try {
  
      const dadosParaAtualizar: Partial<DadosUsuario> = {
        nome: dadosUsuario.nome,
        cpf: dadosUsuario.cpf,
        dataNascimento: dadosUsuario.dataNascimento,
        genero: dadosUsuario.genero,
      };
  
      if (alterandoSenha && dadosUsuario.senha) {
        dadosParaAtualizar.senha = dadosUsuario.senha;
      }
  
      if (fotoAlterada && dadosUsuario.fotoDePerfil) {
        dadosParaAtualizar.fotoDePerfil = dadosUsuario.fotoDePerfil;
      }
  
      const response = await api.patch(`/usuarios/${dadosUsuario.id}`, dadosParaAtualizar);
      
      if (response.data) {
        atualizarDadosDoUsuario({
            nome: dadosUsuario.nome,
            fotoDePerfil: dadosUsuario.fotoDePerfil ?? undefined
          });
          
        setMostrarNotificacao(true);
        setEdicaoAtiva(false);
        setAlterandoSenha(false);
        setFotoAlterada(false);
        setDadosUsuario(prev => ({
          ...prev,
          senha: "",
          confirmarSenha: "",
        }));
        
      }
      
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Dados do erro:", error.response?.data); // Debug
      setMensagem({
        tipo: "erro",
        texto: error.response?.data?.message || "Erro ao atualizar seus dados. Tente novamente."
      });
    } finally {
      setCarregando(false);
    }
  };

  
  
  if (carregando && !dadosUsuario.nome) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <p>Carregando dados</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="minha-conta-container">
      <Toast 
          message="Alterações salvas com sucesso!"
          type="successo"
          show={mostrarNotificacao}
          onClose={() => setMostrarNotificacao(false)}
        />
        <div className="section-header">
          <h1>Minha Conta</h1>
          <div className="header-buttons">
            {!edicaoAtiva && (
              <button 
                onClick={() => setEdicaoAtiva(true)} 
                className="btn-primary"
              >
                Editar Perfil
              </button>
            )}
          </div>
        </div>
        
        {mensagem.texto && (
          <div className={`mensagem ${mensagem.tipo}`}>
            {mensagem.texto}
          </div>
        )}

    <EnderecoUsuario 
        isOpen={showEnderecoModal}
        onClose={() => setShowEnderecoModal(false)}
    />
        
        <div className="conta-content">
          <div className="perfil-foto-container">
            <div className="perfil-foto">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt={dadosUsuario.nome} 
                  className="foto-usuario" 
                />
              ) : (
                <div className="foto-placeholder">
                  {dadosUsuario.nome.charAt(0).toUpperCase()}
                </div>
              )}
              
              {edicaoAtiva && (
                <label className="alterar-foto-label">
                  <input 
                    type="file" 
                    accept="image/jpeg, image/png" 
                    onChange={handleImageChange} 
                    className="input-file" 
                  />
                  <span className="alterar-foto-text">Alterar foto</span>
                </label>
              )}
            </div>
            
            
  {edicaoAtiva && dadosUsuario.fotoDePerfil && (
    <button 
      type="button"
      onClick={async () => {
        try {
          setMensagem({ tipo: "info", texto: "Removendo foto..." });
          setCarregando(true);
          
          await api.patch(`/usuarios/${dadosUsuario.id}`, {
            fotoDePerfil: null
          });
          
          setPreviewImage(null);
          setDadosUsuario(prev => ({ ...prev, fotoDePerfil: null }));
          atualizarDadosDoUsuario({ fotoDePerfil: undefined });
          
          setMensagem({ tipo: "sucesso", texto: "Foto removida com sucesso!" });
        } catch (error) {
          console.error("Erro ao remover foto:", error);
          setMensagem({ 
            tipo: "erro", 
            texto: "Erro ao remover a foto. Tente novamente." 
          });
        } finally {
          setCarregando(false);
        }
      }} 
      className="btn-primary"
    >
      Remover Foto Atual
    </button>
    
  )}      {edicaoAtiva && (
    <button 
      type="button" 
      onClick={() => setShowEnderecoModal(true)} 
      className="btn-primary endereco-btn"
    >
      Endereços
    </button>
  )
  }
         </div>
          <div className="perfil-dados">
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Nome completo</label>
                  <input 
                    type="text" 
                    name="nome" 
                    value={dadosUsuario.nome} 
                    onChange={handleChange} 
                    disabled={!edicaoAtiva} 
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={dadosUsuario.email} 
                    disabled={true} 
                  />
                  <p>O Email não pode ser alterado.</p>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>CPF</label>
                  <input 
                    type="text" 
                    name="cpf" 
                    value={dadosUsuario.cpf} 
                    onChange={handleChange} 
                    disabled={true}
                  />
                  <p>O CPF não pode ser alterado.</p>
                </div>
                
                <div className="form-group">
                  <label>Data de Nascimento</label>
                  <input 
                    type="date" 
                    name="dataNascimento" 
                    value={dadosUsuario.dataNascimento} 
                    onChange={handleChange} 
                    disabled={!edicaoAtiva} 
                    required 
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Gênero</label>
                <select 
                  name="genero" 
                  value={dadosUsuario.genero} 
                  onChange={handleChange} 
                  disabled={!edicaoAtiva} 
                  required
                >
                  <option value="">Selecione</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              
              
              {edicaoAtiva && (
                <div className="senha-section">
                  <div className="form-row senha-header">
                    <h3>Alterar Senha</h3>
                    <label className="toggle-senha">
                      <input
                        type="checkbox"
                        checked={alterandoSenha}
                        onChange={() => setAlterandoSenha(!alterandoSenha)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                  
                  {alterandoSenha && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Nova Senha</label>
                        <input 
                          type="password" 
                          name="senha" 
                          value={dadosUsuario.senha} 
                          onChange={handleChange} 
                          required={alterandoSenha} 
                        />
                        <p> A senha deve conter 6 caracteres, pelo menos uma letra maiúscula e um número.</p>
                      </div>
                      
                      <div className="form-group">
                        <label>Confirmar Nova Senha</label>
                        <input 
                          type="password" 
                          name="confirmarSenha" 
                          value={dadosUsuario.confirmarSenha} 
                          onChange={handleChange} 
                          required={alterandoSenha} 
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {edicaoAtiva && (
                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={() => {
                      setEdicaoAtiva(false);
                      setAlterandoSenha(false);
                      setFotoAlterada(false);
                      setMensagem({ tipo: "", texto: "" });
                      
                      if (user?.id) {
                        const buscarDadosUsuario = async () => {
                          try {
                            const response = await api.get(`/usuarios/${user.id}`);
                            setDadosUsuario({
                              ...response.data,
                              id: response.data.id_usuario || user.id,
                              dataNascimento: new Date(response.data.dataNascimento).toISOString().split('T')[0],
                              senha: "",
                              confirmarSenha: "",
                            });
                            setPreviewImage(response.data.fotoDePerfil);
                          } catch (error) {
                            console.error("Erro ao buscar dados do usuário:", error);
                          }
                        };
                        buscarDadosUsuario();
                      }
                    }} 
                    className="btn-cancel"
                  >
                    Cancelar
                  </button>
                  
                  <button 
                    type="submit" 
                    className="btn-primary" 
                    disabled={carregando}
                  >
                    {carregando ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default MinhaConta;