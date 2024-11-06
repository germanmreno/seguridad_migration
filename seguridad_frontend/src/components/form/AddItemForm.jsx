import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useFormSteps } from "./hooks/useFormSteps";
import { PHONE_OPTIONS, STEPS, formSchema } from "./constants";
import { registerVisitor } from './services/visitorService';

// Import all step components
import { FormTypeStep } from "./steps/FormTypeStep";
import { VisitorTypeStep } from "./steps/VisitorTypeStep";
import { ExistingVisitorStep } from "./steps/ExistingVisitorStep";
import { VisitorPersonalInfoStep } from "./steps/VisitorPersonalInfoStep";
import { VisitInfoStep } from "./steps/VisitInfoStep";
import { FormSummaryStep } from "./steps/FormSummaryStep";
import { FormEnterpriseStep } from "./steps/FormEnterpriseStep";

export function AddItemForm({ onSubmitSuccess }) {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formType: "",
      firstName: "",
      lastName: "",
      dniType: "",
      dniNumber: "",
      contactNumberPrefixId: "",
      phoneNumber: "",
      enterpriseName: "",
      enterpriseRif: "",
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
    },
  });

  const {
    step,
    setStep,
    formType,
    setFormType,
    visitorType,
    setVisitorType,
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
    setStep(STEPS.VISITOR_TYPE);
  };

  // Handle visitor type selection
  const handleVisitorTypeSelect = (type) => {
    setVisitorType(type);
    if (type === 'existing') {
      setStep(STEPS.EXISTING_VISITOR);
    } else {
      setStep(STEPS.PERSONAL_INFO);
    }
  };

  // Handle existing visitor selection
  const handleExistingVisitor = (visitor) => {
    // Map the visitor data to form fields
    form.setValue("firstName", visitor.firstName);
    form.setValue("lastName", visitor.lastName);

    // Map DNI type based on the abbreviation
    const dniTypeValue = visitor.dniType.abbreviation === 'V' ? '1' : '2';
    form.setValue("dniType", dniTypeValue);

    form.setValue("dniNumber", visitor.dniNumber.toString());

    // Handle contact info if it exists
    if (visitor.contactInfo) {
      form.setValue("contactNumberPrefixId", visitor.contactInfo.prefix);
      form.setValue("phoneNumber", visitor.contactInfo.number);
    }

    // Handle company info if it exists
    if (visitor.company) {
      form.setValue("enterpriseName", visitor.company.name);
      form.setValue("enterpriseRif", visitor.company.rif);
    }

    setStep(STEPS.PERSONAL_INFO);
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === STEPS.VISITOR_TYPE) {
      setStep(STEPS.FORM_TYPE);
    } else if (step === STEPS.EXISTING_VISITOR) {
      setStep(STEPS.VISITOR_TYPE);
    } else if (step === STEPS.PERSONAL_INFO) {
      setStep(visitorType === 'existing' ? STEPS.EXISTING_VISITOR : STEPS.VISITOR_TYPE);
    } else if (step === STEPS.ENTERPRISE_INFO) {
      setStep(STEPS.PERSONAL_INFO);
    } else if (step === STEPS.VISIT_INFO) {
      setStep(STEPS.ENTERPRISE_INFO);
    } else if (step === STEPS.SUMMARY) {
      setStep(STEPS.VISIT_INFO);
    }
  };

  // Handle form submission
  const onConfirmSubmit = async () => {
    try {
      const data = form.getValues();
      const formattedContactNumberPrefixId = PHONE_OPTIONS.find(option => option.value === data.contactNumberPrefixId)?.id || 1;
      const formattedVisitTypeId = data.formType === 'pedestrian' ? 1 : 2;

      console.log("Starting submission with data:", data);

      const formattedData = {
        dni_type: data.dniType,
        dni_type_id: parseInt(data.dniType) || 1,
        dni_number: parseInt(data.dniNumber),
        firstName: data.firstName,
        lastName: data.lastName,
        contact_number_prefix_id: formattedContactNumberPrefixId,
        contact_number: data.phoneNumber,
        enterpriseName: data.enterpriseName,
        enterpriseRif: data.enterpriseRif,
        visit_type_id: formattedVisitTypeId,
        entity_id: parseInt(data.entityId),
        administrative_unit_id: parseInt(data.administrativeUnitId),
        area_id: parseInt(data.areaId),
        direction_id: parseInt(data.directionId),
        visit_date: data.dateVisit.toISOString(),
        visit_hour: data.dateHourVisit.toISOString(),
        entry_type: data.entryType || 'pedestrian',
        visit_reason: data.observation || '',
        ...(data.formType === 'vehicle' && {
          vehicle_plate: data.vehiclePlate || '',
          vehicle_model: data.vehicleModel || '',
          vehicle_brand: data.vehicleBrand || '',
          vehicle_color: data.vehicleColor || '',
        }),
      };

      console.log('Formatted Data:', formattedData);
      const result = await registerVisitor(formattedData);

      if (result) {
        toast.success("Registro completado exitosamente");
        form.reset();
        setStep(STEPS.FORM_TYPE);
        setFormType(null);
        setVisitorType(null);
        onSubmitSuccess();
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

      case STEPS.VISITOR_TYPE:
        return (
          <VisitorTypeStep
            onSelectType={handleVisitorTypeSelect}
            onBack={handleBack}
          />
        );

      case STEPS.EXISTING_VISITOR:
        return (
          <ExistingVisitorStep
            onNext={handleExistingVisitor}
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
      <div className="space-y-6">
        <div className="flex justify-between mb-8 sticky top-0 bg-background pt-2 pb-4 z-10">
          {[1, 2, 3, 4, 5, 6, 7].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`flex items-center ${stepNumber < 7 ? 'flex-1' : ''}`}
            >
              <div className={`rounded-full h-8 w-8 flex items-center justify-center border-2 
                ${step >= stepNumber ? 'bg-primary text-white border-primary' : 'border-gray-300'}`}
              >
                {stepNumber}
              </div>
              {stepNumber < 7 && (
                <div className={`flex-1 h-1 mx-2 ${step > stepNumber ? 'bg-primary' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>

        {renderStep()}
      </div>
    </Form>
  );
} 