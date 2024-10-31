import { z } from 'zod';

export const STEPS = {
  FORM_TYPE: 1,
  VISITOR_TYPE: 2,
  EXISTING_VISITOR: 3,
  PERSONAL_INFO: 4,
  ENTERPRISE_INFO: 5,
  VISIT_INFO: 6,
  SUMMARY: 7,
};

export const formSchema = z.object({
  formType: z.string().optional(), // Add formType to the schema
  firstName: z.string({ required_error: 'Campo obligatorio' }).min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  enterpriseName: z.string().min(1, 'El nombre de la empresa es requerido'),
  enterpriseRif: z
    .string()
    .min(1, 'El RIF de la empresa es requerido')
    .regex(/^[JGVEP]-\d{8}-\d$/, 'El RIF debe tener el formato J-12345678-9'),
  lastName: z.string({ required_error: 'Campo obligatorio' }).min(2, {
    message: 'El apellido debe tener al menos 2 caracteres.',
  }),
  dni: z
    .string({ required_error: 'Campo obligatorio' })
    .regex(/^[VE]-\d{2,}$/, {
      message:
        'La cédula debe comenzar con V- o E- seguido de al menos 2 números.',
    }),
  business: z.string({ required_error: 'Campo obligatorio' }).min(2, {
    message: 'La empresa debe tener al menos 2 caracteres.',
  }),
  phonePrefix: z.string({ required_error: 'Campo obligatorio' }),
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
  entityId: z.number().min(1, 'Entidad es requerida'),
  administrativeUnitId: z.number().min(1, 'Unidad Administrativa es requerida'),
  directionId: z.number().optional(),
  areaId: z.number().optional(),
  dateVisit: z.date(),
  dateHourVisit: z.date(),
});

export const PHONE_OPTIONS = [
  { id: '+58412', label: '+58(412)' },
  { id: '+58414', label: '+58(414)' },
  { id: '+58416', label: '+58(416)' },
  { id: '+58424', label: '+58(424)' },
  { id: '+58426', label: '+58(426)' },
];
