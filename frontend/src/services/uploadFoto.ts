export const uploadImagem = async (
  file: File,
  folder?: string
): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  );

  // Se fornecido um folder, adiciona ao FormData
  if (folder) {
    formData.append("folder", folder);
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Falha no upload da imagem");
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Erro no upload:", error);
    throw error;
  }
};
