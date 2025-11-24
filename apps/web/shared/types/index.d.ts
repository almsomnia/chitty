type InferSchema<T> = import("zod").output<T>
type FormSubmitEvent<T> = import("#ui/types").FormSubmitEvent<T>
type TableColumn<T> = import("#ui/types").TableColumn<T>
type Row<T> = import("@tanstack/vue-table").Row<T>
