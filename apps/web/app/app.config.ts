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
         secondary: "emerald",
         neutral: "zinc"
      },
      modal: {
         variants: {
            fullscreen: {
               false: {
                  content: /* @tw */ "min-w-lg max-w-[calc(100vw-2rem)] rounded-lg shadow-lg ring ring-default"
               }
            }
         }
      },
      card: {
         slots: {
            root: "rounded-xl"
         },
         variants: {
            variant: {
               shadow: {
                  root: /* @tw */ "bg-default divide-y divide-default shadow"
               }
            }
         },
         defaultVariants: {
            variant: "shadow"
         }
      }
   }
})
