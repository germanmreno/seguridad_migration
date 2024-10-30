import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { toast } from "sonner";
import { useFormSteps } from "./hooks/useFormSteps";
import { STEPS, formSchema } from "./constants";

// Import all step components
import { FormTypeStep } from "./steps/FormTypeStep";
import { VisitorTypeStep } from "./steps/VisitorTypeStep";
import { ExistingVisitorStep } from "./steps/ExistingVisitorStep";
import { VisitorPersonalInfoStep } from "./steps/VisitorPersonalInfoStep";
import { VisitInfoStep } from "./steps/VisitInfoStep";
import { FormSummaryStep } from "./steps/FormSummaryStep";

export function AddItemForm({ onSubmit }) {

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formType: "",
      firstName: "",
      lastName: "",
      dni: "",
      business: "",
      phonePrefix: "",
      phoneNumber: "",
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
    Object.entries(visitor).forEach(([key, value]) => {
      form.setValue(key, value);
    });
    setStep(STEPS.VISIT_INFO);
  };

  // Handle back navigation
  const handleBack = () => {
    if (step === STEPS.VISITOR_TYPE) {
      setStep(STEPS.FORM_TYPE);
    } else if (step === STEPS.EXISTING_VISITOR) {
      setStep(STEPS.VISITOR_TYPE);
    } else if (step === STEPS.PERSONAL_INFO) {
      setStep(STEPS.VISITOR_TYPE);
    } else if (step === STEPS.VISIT_INFO) {
      setStep(visitorType === 'existing' ? STEPS.EXISTING_VISITOR : STEPS.PERSONAL_INFO);
    } else if (step === STEPS.SUMMARY) {
      setStep(STEPS.VISIT_INFO);
    }
  };

  // Handle form submission
  const handleSubmit = async (data) => {
    try {
      await onSubmit(data);
      toast.success("Registro completado exitosamente");
      // Reset form and state
      form.reset();
      setStep(STEPS.FORM_TYPE);
      setFormType(null);
      setVisitorType(null);
    } catch (error) {
      toast.error("Error al procesar el registro");
      console.error("Form submission error:", error);
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
            onConfirm={form.handleSubmit(handleSubmit)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <div className="flex justify-between mb-8 sticky top-0 bg-background pt-2 pb-4 z-10">
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

        {renderStep()}
      </form>
    </Form>
  );
} 