import { LayoutDashboard, Shapes, Tag,} from "lucide-react";

export const navLinks = [
  {
    url: "/",
    icon: <LayoutDashboard />,
    label: "Dashboard",
  }, 
  {
    url: "/features",
    icon: <Shapes />,
    label: "Features",
  },
  {
    url: "/lowmileages",
    icon: <Shapes />,
    label: "Low Mileages",
  },
  {
    url: "/products",
    icon: <Tag />,
    label: "Products",
  },

];
