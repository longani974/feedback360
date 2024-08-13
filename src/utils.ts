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
    const path = pathname.replace('/app', '').split('/')[1] || '';
    switch (path) {
        case '':
            return 'Tableau de bord';
        case 'feedbacks':
            return 'Feedbacks';
        case 'profile':
            return 'Mon profil';
        case 'organisations':
            return 'Mes Organisations';
        case 'add-organisation':
            return 'Nouvelle Organisation';
        default:
            return 'Page';
    }
};
