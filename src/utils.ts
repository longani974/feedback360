// Fonction pour vérifier si le chemin actuel commence par le chemin fourni
export const isActive = (path: string, exact = false) => {
    if (exact) {
        return location.pathname === path;
    }
    return location.pathname.startsWith(path);
};

export const getLinkClassName = (path: string, exact = false) => {
    const baseClass =
        'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary';
    return isActive(path, exact)
        ? `${baseClass} bg-muted text-primary`
        : baseClass;
};

export const getPageTitle = (pathname: string) => {
    const path = pathname.replace('/app', '').split('/');
    const basePath = path[1] || '';
    const subPath = path[2] || '';

    switch (basePath) {
        case '':
            return 'Tableau de bord';
        case 'feedbacks':
            return 'Feedbacks';
        case 'profile':
            return 'Mon profil';
        case 'organisations':
            return subPath ? 'Organisation' : 'Mes Organisations';
        case 'add-organisation':
            return 'Créer une Organisation';
        default:
            return 'Page';
    }
};
