import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useFormSteps } from "./hooks/useFormSteps";
import { PHONE_OPTIONS, STEPS, formSchema } from "./constants";
import { registerVisitor } from './services/visitorService';

// Import all step components
import { FormTypeStep } from "./steps/FormTypeStep";
import { VisitorPersonalInfoStep } from "./steps/VisitorPersonalInfoStep";
import { FormEnterpriseStep } from "./steps/FormEnterpriseStep";
import { VisitInfoStep } from "./steps/VisitInfoStep";
import { FormSummaryStep } from "./steps/FormSummaryStep";
import { VisitorSearchStep } from "./steps/VisitorSearchStep";

export function AddItemForm({ onSubmitSuccess }) {

  const form = useForm({
    defaultValues: {
      dniType: '',
      dniNumber: '',
      formType: "",
      firstName: "",
      lastName: "",
      contactNumberPrefixId: "",
      phoneNumber: "",
      enterpriseName: "",
      entityId: "",
      entityName: "",
      administrativeUnitId: "",
      administrativeUnitName: "",
      directionId: "",
      directionName: "",
      areaId: "",
      areaName: "",
      contact: "",
      observation: "",
      vehiclePlate: "",
      vehicleModel: "",
      vehicleBrand: "",
      vehicleColor: "",
      dateVisit: new Date(),
      dateHourVisit: new Date(),
      visitorPhoto: "",
    },
    resolver: zodResolver(formSchema)
  });

  const {
    step,
    setStep,
    formType,
    setFormType,
    loading,
    entities,
    adminUnits,
    directions,
    areas,
    loadEntities,
    loadAdminUnits,
    loadDirections,
    loadAreas,
  } = useFormSteps(form);

  // Handle form type selection
  const handleFormTypeSelect = (type) => {
    setFormType(type);
    form.setValue("formType", type);
    setStep(STEPS.DNI_SEARCH);
  };

  // Handle visitor data from DNI search
  const handleVisitorData = (visitorData) => {
    if (visitorData) {
      console.log('Setting visitor data:', visitorData);

      // Set form values
      form.setValue('dniType', visitorData.dniType);
      form.setValue('dniNumber', visitorData.dniNumber.toString());

      if (!visitorData.isNewVisitor) {
        form.setValue('firstName', visitorData.firstName);
        form.setValue('lastName', visitorData.lastName);
        if (visitorData.contactInfo) {
          form.setValue('contactNumberPrefixId', visitorData.contactInfo.prefix);
          form.setValue('phoneNumber', visitorData.contactInfo.number);
        }
        if (visitorData.company) {
          form.setValue('enterpriseName', visitorData.company.name);
        }
      }

      // Advance to the next step
      setStep(STEPS.PERSONAL_INFO);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    switch (step) {
      case STEPS.DNI_SEARCH:
        setStep(STEPS.FORM_TYPE);
        break;
      case STEPS.PERSONAL_INFO:
        setStep(STEPS.DNI_SEARCH);
        break;
      case STEPS.ENTERPRISE_INFO:
        setStep(STEPS.PERSONAL_INFO);
        break;
      case STEPS.VISIT_INFO:
        setStep(STEPS.ENTERPRISE_INFO);
        break;
      case STEPS.SUMMARY:
        setStep(STEPS.VISIT_INFO);
        break;
    }
  };

  // Handle form submission
  const onConfirmSubmit = async () => {
    try {
      const data = form.getValues();
      const formattedContactNumberPrefixId = PHONE_OPTIONS.find(option => option.value === data.contactNumberPrefixId)?.id || 1;
      const formattedVisitTypeId = data.formType === 'pedestrian' ? 1 : 2;
      const dniTypeId = data.dniType === 'V' ? 1 : 2;

      const formattedData = {
        dni_type_id: dniTypeId,
        dni_number: parseInt(data.dniNumber),
        firstName: data.firstName,
        lastName: data.lastName,
        contact_number_prefix_id: formattedContactNumberPrefixId,
        contact_number: data.phoneNumber,
        visit_type_id: formattedVisitTypeId,
        entity_id: parseInt(data.entityId),
        administrative_unit_id: parseInt(data.administrativeUnitId),
        area_id: data.areaId ? parseInt(data.areaId) : null,
        direction_id: data.directionId ? parseInt(data.directionId) : null,
        visit_date: data.dateVisit.toISOString(),
        visit_hour: data.dateHourVisit.toISOString(),
        entry_type: data.entryType || 'pedestrian',
        visit_reason: data.observation || '',
        contact: data.contact || '',
        enterpriseName: data.enterpriseName,
        ...(data.formType === 'vehicle' && {
          vehicle_plate: data.vehiclePlate || '',
          vehicle_model: data.vehicleModel || '',
          vehicle_brand: data.vehicleBrand || '',
          vehicle_color: data.vehicleColor || '',
        }),
      };

      console.log('Final formatted data:', formattedData);
      const result = await registerVisitor(formattedData);

      if (result && result.data) {
        toast.success("Registro completado exitosamente");
        form.reset();
        setStep(STEPS.FORM_TYPE);
        setFormType(null);
        if (typeof onSubmitSuccess === 'function') {
          onSubmitSuccess();
        }
      } else {
        throw new Error('No se recibió respuesta del servidor');
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Error al procesar el registro");
    }
  };

  // Render current step
  const renderStep = () => {
    switch (step) {
      case STEPS.FORM_TYPE:
        return <FormTypeStep onSelectType={handleFormTypeSelect} />;

      case STEPS.DNI_SEARCH:
        return (
          <VisitorSearchStep
            onNext={handleVisitorData}
            onBack={handleBack}
          />
        );

      case STEPS.PERSONAL_INFO:
        return (
          <VisitorPersonalInfoStep
            form={form}
            formType={formType}
            onNext={() => setStep(STEPS.ENTERPRISE_INFO)}
            onBack={handleBack}
          />
        );

      case STEPS.ENTERPRISE_INFO:
        return (
          <FormEnterpriseStep
            form={form}
            onNext={() => setStep(STEPS.VISIT_INFO)}
            onBack={handleBack}
          />
        );

      case STEPS.VISIT_INFO:
        return (
          <VisitInfoStep
            form={form}
            entities={entities}
            adminUnits={adminUnits}
            directions={directions}
            areas={areas}
            loading={loading}
            onNext={() => setStep(STEPS.SUMMARY)}
            onBack={handleBack}
            loadEntities={loadEntities}
            loadAdminUnits={loadAdminUnits}
            loadDirections={loadDirections}
            loadAreas={loadAreas}
          />
        );

      case STEPS.SUMMARY:
        return (
          <FormSummaryStep
            formData={form.getValues()}
            onBack={handleBack}
            onConfirm={onConfirmSubmit}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <div className="flex flex-col h-full min-h-[400px]">
        {/* Progress Steps */}
        <div className="flex-none bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 pt-2 pb-4 z-10 px-4 m-2">
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${stepNumber < 6 ? 'flex-1' : ''}`}
              >
                <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                  ${step >= stepNumber ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 6 && (
                  <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? 'bg-primary' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content Area - adjusted to be more responsive */}
        <div className="flex-1 overflow-y-auto px-4 min-h-0">
          <div className="w-full mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-sm h-fit">
            {renderStep()}
          </div>
        </div>
      </div>
    </Form>
  );
} 