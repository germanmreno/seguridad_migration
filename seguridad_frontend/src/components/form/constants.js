import { z } from 'zod';

export const STEPS = {
  FORM_TYPE: 1,
  DNI_SEARCH: 2,
  PERSONAL_INFO: 3,
  ENTERPRISE_INFO: 4,
  VISIT_INFO: 5,
  SUMMARY: 6,
};

export const formSchema = z.object({
  formType: z.string().optional(), // Add formType to the schema
  firstName: z.string({ required_error: 'Campo obligatorio' }).min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  enterpriseName: z.string().min(1, 'El nombre de la empresa es requerido'),
  lastName: z.string({ required_error: 'Campo obligatorio' }).min(2, {
    message: 'El apellido debe tener al menos 2 caracteres.',
  }),
  dniType: z.string().min(1, 'Tipo de cédula es requerido'),
  dniNumber: z
    .string({ required_error: 'Campo obligatorio' })
    .regex(/^\d{2,}$/, {
      message: 'Ingrese solo números (mínimo 2 dígitos)',
    }),
  phonePrefix: z.string({ required_error: 'Campo obligatorio' }),
  phonePrefixId: z.string({ required_error: 'Campo obligatorio' }),
  phoneNumber: z
    .string({ required_error: 'Campo obligatorio' })
    .regex(/^\d+$/, {
      message: 'Ingrese solo números',
    })
    .min(7, {
      message: 'El número debe tener al menos 7 dígitos',
    }),
  gerency: z.string({ required_error: 'Campo obligatorio' }).min(2, {
    message: 'El ente debe tener al menos 2 caracteres.',
  }),
  contact: z.string({ required_error: 'Campo obligatorio' }).min(2, {
    message: 'El contacto debe tener al menos 2 caracteres.',
  }),
  observation: z.string().optional(),
  // Add optional vehicle fields that are required only when formType is 'visitor'
  vehiclePlate: z
    .string()
    .min(6, {
      message: 'La placa del vehículo debe cumplir con el formato ABC123.',
    })
    .superRefine((val, ctx) => {
      const formType = ctx.parent?.formType;
      if (formType === 'vehicle' && !val) {
        console.log(val);
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Campo obligatorio para registro vehicular',
        });
      }
    }),
  vehicleBrand: z
    .string()
    .min(3, {
      message: 'La marca del vehículo debe tener al menos 3 caracteres',
    })
    .superRefine((val, ctx) => {
      const formType = ctx.parent?.formType;
      if (formType === 'vehicle' && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Campo obligatorio para registro vehicular',
        });
      }
    }),
  vehicleModel: z
    .string()
    .min(4, {
      message: 'El modelo del vehículo debe tener al menos 4 caracteres',
    })
    .superRefine((val, ctx) => {
      const formType = ctx.parent?.formType;
      if (formType === 'vehicle' && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Campo obligatorio para registro vehicular',
        });
      }
    }),
  vehicleColor: z
    .string()
    .min(3, {
      message: 'El color del vehículo debe tener al menos 3 caracteres',
    })
    .superRefine((val, ctx) => {
      const formType = ctx.parent?.formType;
      if (formType === 'vehicle' && !val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Campo obligatorio para registro vehicular',
        });
      }
    }),
  date: z.date({ required_error: 'Campo obligatorio' }),
  entityId: z.number({
    required_error: 'Por favor seleccione un ente para continuar',
    invalid_type_error: 'Por favor seleccione un ente para continuar',
  }),
  administrativeUnitId: z
    .union([z.number(), z.null()])
    .superRefine((val, ctx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Requiere seleccionar una Unidad Administrativa',
        });
      }
    }),
  administrativeUnitName: z.string().optional(),
  directionId: z.number().optional(),
  areaId: z.number().optional(),
  dateVisit: z.date(),
  dateHourVisit: z.date(),
  visitorPhoto: z.string({
    required_error: 'La foto del visitante es requerida',
  }),
});

export const PHONE_OPTIONS = [
  { id: 1, value: '+58(412)', label: '+58 (412)' },
  { id: 2, value: '+58(414)', label: '+58 (414)' },
  { id: 3, value: '+58(424)', label: '+58 (424)' },
  { id: 4, value: '+58(416)', label: '+58 (416)' },
  { id: 5, value: '+58(426)', label: '+58 (426)' },
];

export const DNI_TYPES = [
  { id: 1, value: 'V', label: 'V-' },
  { id: 2, value: 'E', label: 'E-' },
];
