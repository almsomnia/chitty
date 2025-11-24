export default defineAppConfig({
   menu: [
      [
         {
            label: "Dashboard",
            to: "/",
            icon: "lucide:home",
         },
         {
            label: "Tasks List",
            to: "/tasks/list",
            icon: "lucide:clipboard",
         },
         {
            label: "Users",
            to: "/users",
            icon: "lucide:users"
         }
      ],
   ],
   ui: {
      colors: {
         primary: "fuchsia",
         neutral: "zinc"
      }
   }
})
