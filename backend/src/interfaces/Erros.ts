interface ErrosSequelize {
    name: string;
    errors: Array<{
        message: string;
        type: string;
        path: string;
    }>;
}

export function formatarErros(erro: unknown): erro is ErrosSequelize {
    return (
        typeof erro === 'object' &&
        erro !== null &&
        'name' in erro &&
        'errors' in erro
    );
}