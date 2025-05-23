import { useLocation, Link } from 'react-router-dom';

const Breadcrumb = () => {
    const location = useLocation();
    const { pathname, search } = location;

    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbs = ['', ...segments.slice(0, -1)]; // all but last
    const lastSegment = segments[segments.length - 1]; // last part like "something"

    return (
        <nav className="p-4 text-[15px] font-medium">
            <div className="max-w-screen-lg mx-lauto">
                <div className="flex flex-wrap items-center space-x-2">
                    {breadcrumbs.map((segment, index) => {
                        const path = '/' + breadcrumbs.slice(1, index + 1).join('/');
                        const label = segment === '' ? 'Dashboard' : decodeURIComponent(segment);

                        return (
                            <span key={index} className="flex items-center space-x-1">
                               {index>0 && <span className="mx-1 text-gray-400">/</span>}
                                {index!==2?
                                <Link to={path} className="text-muted-foreground capitalize">
                                    {label}
                                </Link>:<span className="text-muted-foreground capitalize">
                                    {label}
                                </span>}
                            </span>
                        );
                    })}

                    {/* Last segment with query string */}
                    {lastSegment && (
                        <span className="flex items-center space-x-1">
                            {segments.length > 0 && <span>/</span>}
                            <Link
                                to={`${pathname}${search}`}
                                className="text-primary font-medium capitalize"
                            >
                                {decodeURIComponent(lastSegment )}
                            </Link>
                        </span>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Breadcrumb;
