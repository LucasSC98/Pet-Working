import { useState, useRef } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { uploadImagem } from "../services/uploadFoto";
import "../styles/CadastroPet.css";
import Input from "../components/Input";
import Toast from "../components/Toast";
import RecorteFoto from "../components/RecorteFoto";
import { Pencil, Trash } from "lucide-react";

interface Pet {
  id_pet?: number;
  nome: string;
  idade: number;
  especie: string;
  raca: string;
  foto: string;
  peso: number;
  descricao: string;
}

interface CadastroPetProps {
  onClose: () => void;
  onPetAdded: () => void;
  petParaEditar?: Pet; // Novo prop opcional
  modo?: "cadastro" | "edicao"; // Novo prop para controlar o modo
}

const CadastroPet = ({
  onClose,
  onPetAdded,
  petParaEditar,
  modo = "cadastro",
}: CadastroPetProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    nome: petParaEditar?.nome || "",
    idade: petParaEditar?.idade?.toString() || "",
    especie: petParaEditar?.especie || "",
    raca: petParaEditar?.raca || "",
    foto: petParaEditar?.foto || "",
    peso: petParaEditar?.peso?.toString() || "",
    descricao: petParaEditar?.descricao || "",
  });
  const [isVisible, setIsVisible] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [mensagemNotificacao, setMensagemNotificacao] = useState("");
  const [tipoNotificacao, setTipoNotificacao] = useState<
    "successo" | "erro" | "mensagem" | "aviso"
  >();
  const [toastId, setToastId] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(
    petParaEditar?.foto || null
  );
  const [carregando, setCarregando] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const currentImageFileRef = useRef<File | null>(null);

  const validarFormulario = () => {
    const novosErros: Record<string, string> = {};

    if (!formData.nome.trim()) {
      novosErros.nome = "O nome do pet é obrigatório";
    }

    if (!formData.idade) {
      novosErros.idade = "A idade do pet é obrigatória";
    } else if (parseInt(formData.idade) < 0) {
      novosErros.idade = "A idade não pode ser negativa";
    }

    if (!formData.especie) {
      novosErros.especie = "A espécie do pet é obrigatória";
    }

    if (!formData.raca.trim()) {
      novosErros.raca = "A raça do pet é obrigatória";
    }

    if (!formData.peso) {
      novosErros.peso = "O peso do pet é obrigatório";
    } else if (parseFloat(formData.peso) <= 0) {
      novosErros.peso = "O peso deve ser maior que zero";
    }

    setErrors(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validarFormulario()) {
      setTipoNotificacao("erro");
      setMensagemNotificacao(
        "Por favor, preencha todos os campos obrigatórios corretamente!"
      );
      setToastId("pet-validacao-erro");
      setShowToast(true);
      return;
    }

    try {
      if (modo === "edicao" && petParaEditar) {
        await api.patch(`/pets/${petParaEditar.id_pet}`, {
          ...formData,
          id_usuario: user?.id,
        });
        setMensagemNotificacao("Pet atualizado com sucesso!");
        setToastId("pet-editado-sucesso");
      } else {
        await api.post("/pets", {
          ...formData,
          id_usuario: user?.id,
        });
        setMensagemNotificacao("Pet cadastrado com sucesso!");
        setToastId("pet-cadastrado-sucesso");
      }
      setTipoNotificacao("successo");
      setShowToast(true);

      // Aguardar um pouco para garantir que o toast seja exibido
      await new Promise((resolve) => setTimeout(resolve, 100));

      onPetAdded();

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Erro:", error);
      setTipoNotificacao("erro");
      setMensagemNotificacao(
        "Erro ao salvar o pet. Verifique os dados e tente novamente!"
      );
      setToastId("pet-erro-salvar");
      setShowToast(true);
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // Se for o campo de foto URL, atualizar o preview
    if (name === "foto" && value) {
      setPreviewImage(value);
    } else if (name === "foto" && !value) {
      setPreviewImage(null);
    }
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Sempre primeiro cria preview para o usuário decidir
      const imageUrl = URL.createObjectURL(file);
      setTempImage(imageUrl);
      // Armazenar o arquivo original para uso posterior
      currentImageFileRef.current = file;
    }
  };
  const handleCroppedImage = async (croppedImageUrl: string) => {
    try {
      setCarregando(true);
      setMensagemNotificacao("Enviando foto do pet...");
      setTipoNotificacao("mensagem");
      setToastId("pet-foto-enviando");
      setShowToast(true);

      let imageUrl: string;

      // Se a URL começa com 'blob:', é uma imagem recortada
      if (croppedImageUrl.startsWith("blob:")) {
        const response = await fetch(croppedImageUrl);
        const blob = await response.blob();
        imageUrl = await uploadImagem(blob as File, "pets");
      } else {
        // Se não, é uma URL já válida (upload direto)
        imageUrl = croppedImageUrl;
      }

      setPreviewImage(imageUrl);
      setFormData((prev) => ({ ...prev, foto: imageUrl }));
      setTempImage(null);
      setMensagemNotificacao("Foto enviada com sucesso!");
      setTipoNotificacao("successo");
      setToastId("pet-foto-sucesso");
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      setMensagemNotificacao("Erro ao enviar foto. Tente novamente.");
      setTipoNotificacao("erro");
      setToastId("pet-foto-erro");
    } finally {
      setCarregando(false);
      setShowToast(true);
    }
  };
  const handleImageUsedDirectly = async () => {
    try {
      setCarregando(true);
      setMensagemNotificacao("Enviando foto do pet...");
      setTipoNotificacao("mensagem");
      setToastId("pet-foto-enviando");
      setShowToast(true);

      // Usar o arquivo original armazenado
      if (currentImageFileRef.current) {
        const uploadedImageUrl = await uploadImagem(
          currentImageFileRef.current,
          "pets"
        );
        setPreviewImage(uploadedImageUrl);
        setFormData((prev) => ({ ...prev, foto: uploadedImageUrl }));
      }

      setTempImage(null);
      setMensagemNotificacao("Foto enviada com sucesso!");
      setTipoNotificacao("successo");
      setToastId("pet-foto-sucesso");
      setShowToast(true);
    } catch (error) {
      console.error("Erro ao enviar foto:", error);
      setMensagemNotificacao("Erro ao enviar foto. Tente novamente.");
      setTipoNotificacao("erro");
      setToastId("pet-foto-erro");
      setShowToast(true);
    } finally {
      setCarregando(false);
    }
  };

  const handleEditImage = () => {
    setTempImage(previewImage);
  };

  const handleRemoveImage = () => {
    setPreviewImage(null);
    setFormData((prev) => ({ ...prev, foto: "" }));
  };

  const handleClose = () => {
    const overlay = document.querySelector(".cadastro-pet-overlay");
    if (overlay) {
      overlay.classList.remove("sliding-in");
      overlay.classList.add("sliding-out");
      setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, 300);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`cadastro-pet-overlay ${
        isVisible ? "sliding-in" : "sliding-out"
      }`}
    >
      {" "}
      <Toast
        message={mensagemNotificacao}
        type={tipoNotificacao}
        show={showToast}
        testId={toastId}
        onClose={() => setShowToast(false)}
      />
      <div className="cadastro-pet-container">
        <button onClick={handleClose} className="close-button" type="button">
          x
        </button>
        <h1>{modo === "edicao" ? "Editar Pet" : "Cadastrar Pet"}</h1>{" "}
        <form onSubmit={handleSubmit} data-testid="form-pet">
          <Input
            label="Nome:"
            type="text"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            textColor="#026a6e"
            error={errors.nome}
            data-testid="input-nome"
          />
          <Input
            label="Idade:"
            type="number"
            name="idade"
            value={formData.idade}
            onChange={handleChange}
            textColor="#026a6e"
            error={errors.idade}
            data-testid="input-idade"
          />
          <Input
            label="Espécie:"
            type="select"
            name="especie"
            value={formData.especie}
            onChange={handleChange}
            textColor="#026a6e"
            placeholder="Selecione a espécie"
            data-testid="select-especie"
            options={[
              { value: "", label: "Selecione a espécie" },
              { value: "Cachorro", label: "Cachorro" },
              { value: "Gato", label: "Gato" },
              { value: "Ave", label: "Ave" },
              { value: "Roedor", label: "Roedor" },
              { value: "Peixe", label: "Peixe" },
              { value: "Réptil", label: "Réptil" },
              { value: "Anfíbio", label: "Anfíbio" },
              { value: "Inseto", label: "Inseto" },
              { value: "Aracnídeo", label: "Aracnídeo" },
              { value: "Equino", label: "Equino" },
              { value: "Bovino", label: "Bovino" },
              { value: "Caprino", label: "Caprino" },
              { value: "Outro", label: "Outro" },
            ]}
            error={errors.especie}
          />{" "}
          <Input
            label="Raça:"
            type="text"
            name="raca"
            value={formData.raca}
            onChange={handleChange}
            textColor="#026a6e"
            error={errors.raca}
            data-testid="input-raca"
          />
          <Input
            label="URL da Foto (opcional):"
            type="url"
            name="foto"
            value={formData.foto}
            onChange={handleChange}
            textColor="#026a6e"
            placeholder="https://exemplo.com/foto.jpg"
            data-testid="input-foto-url"
          />
          <div className="form-group">
            {" "}
            <div className="upload-container">
              <label
                htmlFor="foto"
                className="upload-label"
                data-testid="label-foto-pet"
              >
                {previewImage ? "Trocar foto do pet" : "Escolher foto do pet"}
              </label>

              <input
                type="file"
                id="foto"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                data-testid="input-foto-pet"
              />

              {tempImage ? (
                <RecorteFoto
                  imageUrl={tempImage}
                  onImageCropped={handleCroppedImage}
                  onImageUsedDirectly={handleImageUsedDirectly}
                  onCancel={() => setTempImage(null)}
                />
              ) : (
                <div className="preview-container">
                  {previewImage && (
                    <div className="image-actions">
                      <button
                        type="button"
                        className="image-button edit"
                        onClick={handleEditImage}
                      >
                        <Pencil size={16} />
                        Editar
                      </button>
                      <button
                        type="button"
                        className="image-button remove"
                        onClick={handleRemoveImage}
                      >
                        <Trash size={16} />
                        Remover
                      </button>
                    </div>
                  )}
                  <div className="image-preview">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview do Pet"
                        className="preview-img"
                      />
                    ) : (
                      <div className="placeholder-text">
                        <i className="fas fa-paw"></i>
                        <p>Clique no botão acima para selecionar uma foto</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {carregando && (
                <div className="loading-indicator">
                  <i className="fas fa-spinner fa-spin"></i> Enviando...
                </div>
              )}
            </div>
          </div>{" "}
          <Input
            label="Peso:"
            type="number"
            name="peso"
            value={formData.peso}
            onChange={handleChange}
            textColor="#026a6e"
            error={errors.peso}
            data-testid="input-peso"
          />
          <Input
            label="Descrição:"
            type="text"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            textColor="#026a6e"
            placeholder="Digite uma descrição (opcional)"
            data-testid="input-descricao"
          />
          <button
            type="submit"
            className="btn-primary"
            data-testid="btn-salvar-pet"
          >
            {modo === "edicao" ? "Salvar Alterações" : "Cadastrar Pet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CadastroPet;
