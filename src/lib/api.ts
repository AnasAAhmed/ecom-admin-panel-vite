import { toast } from "sonner";
import { API_BASE } from "../App";

type OrderResponse = {
    data: any[];
    totalPages: number;
    totalOrders: number;
};
type SingleOrderResponse = Order;
type CollectionsResponse = {
    data: CollectionType[];
    totalPages: number;
    totalCollections: number;
};
export const fetchOrders = async (key: string, query: string, page: number, sort: string, field: string): Promise<OrderResponse> => {


    const res = await fetch(`${API_BASE}/api/admin/orders?key=${key}&query=${query}&page=${page}&sort=${sort}&sortField=${field}`, {
        method: 'GET',
        credentials: "include",

    });
    if (!res.ok) { throw new Error(await res.text()) };
    return res.json();
};
export const fetchSingleOrder = async (orderId: string): Promise<SingleOrderResponse> => {


    const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
        method: 'GET',
        credentials: "include",

    });
    if (!res.ok) { throw new Error(await res.text()) };
    return res.json();
};
export const fetchUser = async () => {
    const res = await fetch(`${API_BASE}/api/admin/auth/session`, {
        method: 'GET',
        credentials: 'include'
    });
    if (!res.ok) return (await res.text());
    return res.json();
};

export const logoutUser = async () => {
    const res = await fetch(`${API_BASE}/api/admin/auth/session`, {
        method: 'POST',
        credentials: 'include'
    });

    return await res.text();

};

export const fetchAdminData = async () => {


    const res = await fetch(API_BASE + "/api/admin", {
        method: "GET",
        credentials: "include",

    });

    if (!res.ok) {
        toast.error(res.statusText)

        throw new Error(res.statusText + " Failed to fetch admin data.");
    }

    return res.json();
};
export const fetchHomePageData = async () => {


    const res = await fetch(API_BASE + "/api/admin/home-page", {
        method: "GET",
        credentials: "include",

    });

    if (!res.ok) {
        toast.error(res.statusText)

        throw new Error(res.statusText + " Failed to fetch home-page data.");
    }

    return res.json();
};
export const fetchCollections = async (key: string, query: string, page: number, sort: string, field: string): Promise<CollectionsResponse> => {

    const res = await fetch(API_BASE + `/api/admin/collections?key=${key}&query=${query}&page=${page}&sort=${sort}&sortField=${field}`, {
        method: 'GET',
        credentials: "include",

    });
    if (!res.ok) {
        toast.error(res.statusText)

        throw new Error(res.statusText + " Failed to fetch admin data.");
    }
    return res.json();
};
export const fetchSingleProduct = async (productId?: string) => {

    if (!productId) {
        toast.error("Product Id is required frontend")
        throw new Error("Product Id is required frontend");

    }
    const res = await fetch(API_BASE + "/api/admin/products/" + productId, {
        method: "GET",
        credentials: "include",

    });
    if (!res.ok) {
        toast.error(res.statusText)

        throw new Error(res.statusText + " Failed to fetch admin data.");
    }
    return res.json();
};

export const fetchSingleCollection = async (id?: string) => {

    if (!id) {
        toast.error("Collection Id is required frontend")
        throw new Error("Collection Id is required frontend");

    }
    const res = await fetch(API_BASE + "/api/admin/collections/" + id, {
        method: "GET",
        credentials: "include",
    });
    if (!res.ok) {
        toast.error(res.statusText)

        throw new Error(res.statusText + " Failed to fetch admin data.");
    }
    return res.json();
};