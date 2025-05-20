import { Database, Home, Image, LayoutDashboard, LogOut, Plus, Shapes, ShoppingBag, Store, Tag, UsersRound } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger2,
} from "./ui/sidebar"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth";
import { logoutUser } from "../lib/api";
import { toast } from "sonner";

// Menu items.
const navLinks = [
  {
    url: "/",
    icon: LayoutDashboard,
    label: "Dashboard",
    tooltip: "Dashboard"
  },
  {
    url: "/collections",
    icon: Shapes,
    label: "Collections",
    tooltip: "Collections"
  },
  {
    url: "/products",
    icon: Tag,
    label: "Products",
    tooltip: "Products"
  },
  {
    url: "/orders",
    icon: ShoppingBag,
    label: "Orders",
    tooltip: "Orders"
  },
  {
    url: "/customers",
    icon: UsersRound,
    label: "Customers",
    tooltip: "Customers"
  },
  {
    url: "/home-page",
    icon: Home,
    label: "Customize HomePage",
    tooltip: "Customize Store's HomePage"
  },
  {
    url: "/products/new",
    icon: Plus,
    label: "New Product",
    tooltip: "Create Product"
  },
  {
    url: "/collections/new",
    icon: Plus,
    label: "New Collection",
    tooltip: "Create Collection"
  },
  {
    url: import.meta.env.VITE_API_URL || '',
    icon: Store,
    label: "Visit Store",
    tooltip: "Visit Store"
  },
  {
    url: "https://cloud.mongodb.com/v2/65b3baabab1c8227914ad4b4#/metrics/replicaSet/65b3bbec62dbc8211cf608b0/explorer/Borcelle_Admin",
    icon: Database,
    label: "Mongodb Dashboard",
    tooltip: "Mongodb Dashboard"
  },
  {
    url: "/image-upload",
    icon: Image,
    label: "Upload Image",
    tooltip: "Upload Image"
  },
];
export function AppSidebar() {
  const { user, clearUser } = useAuth();

  async function logout() {
    try {
      if (!user) return;

      toast.loading('Logging out...');

      const userFetch = await logoutUser();

      if (typeof userFetch === 'string') {
        throw new Error(userFetch);
      }

      clearUser();
      toast.dismiss();
      toast.success("Logged out");

      window.location.href = '/login';

    } catch (error) {
      toast.dismiss();
      toast.error((error as Error).message);
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem >
                <SidebarMenuButton asChild>
                  <SidebarTrigger2 className="cursor-pointer border gap-3 h-12 bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50" title={'Dashboard'} >
                    <img src="/logo.png" alt="Logo hai bencho" className="rounded-full w-8 h-8" />
                    <img src="/logo.webp" alt="Logo hai bencho" className="rounded-full w-[110px] h-[30px]" />
                  </SidebarTrigger2>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel >Pages </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navLinks.slice(0, 5).map((item) => (
                <SidebarMenuItem key={item.tooltip}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.tooltip}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-all"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-[15px] font-medium text-gray-600 dark:text-gray-300">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>

          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navLinks.slice(5, 8).map((item) => (
                <SidebarMenuItem key={item.tooltip}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.tooltip}
                  >
                    <Link
                      to={item.url}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-all"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-[15px] font-medium text-gray-600 dark:text-gray-300">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Others</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {navLinks.slice(8, 11).map((item) => (
                <SidebarMenuItem key={item.tooltip}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.tooltip}
                  >
                    <Link
                      to={item.url}
                      target={item.url.startsWith('http') ? '_blank' : "_self"}
                      className="flex items-center gap-3 w-full px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-md transition-all"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span className="text-[15px] font-medium text-gray-600 dark:text-gray-300">
                        {item.label}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              <SidebarMenuItem >
                <SidebarMenuButton
                  asChild
                  tooltip={'Logout'}
                >
                  <button
                    onClick={() => logout()}
                    className="flex cursor-pointer w-full items-center gap-3"
                  >
                    <LogOut className="w-5 h-5 shrink-0" />
                    <span className="text-[15px] font-medium text-gray-600 dark:text-gray-300">
                      Logout
                    </span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          asChild
        >
          <div className="my-2">
            <img src={user?.image || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQi8g4SCwU1BMb3eCweY1Jv87ZBYMecvinUNQ&s'} alt="avatar hai bencho" className="rounded-full w-8 h-8" />
            <p className="text-[15px] text-accent-foreground font-medium">{user?.name} <small>{user?.email}</small></p>

          </div>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  )
}
