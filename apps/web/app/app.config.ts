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
      ],
   ],
   ui: {
      colors: {
         primary: "fuchsia",
         neutral: "zinc"
      }
   }
})
