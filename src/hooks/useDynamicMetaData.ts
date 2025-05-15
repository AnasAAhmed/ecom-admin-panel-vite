import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageTitle } from '../lib/utils';

const useDynamicMeta = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;

        // if (!path.startsWith('/products/edit') && !path.startsWith('/collections/edit')) {
            const title = path === '/'
                ? 'Borcelle Admin By Anas Ahmed'
                : `${path} | Borcelle Admin By Anas Ahmed`;
            document.title = pageTitle(title);

            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                let content = '';

                if (path === '/') {
                    content = 'Welcome to Borcelle Admin - manage your e-commerce store with tools built by Anas Ahmed.';
                } else {
                    content = `${pageTitle(path)} page at Borcelle Admin Dashboard made by Anas Ahmed using Vite/React.js, Node.js backend, and RTK caching strategies secure HttpOnly Cookie based auth.`;
                }

                metaDesc.setAttribute('content', content);
            }
        // }
    }, [location]);
};

export default useDynamicMeta;
