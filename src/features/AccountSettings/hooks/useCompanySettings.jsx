import { useEffect } from "react";
import { useForm } from "react-hook-form";

const useCompanySettings = (companyInfo) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    criteriaMode: "all",
    mode: "onChange",
  });

  useEffect(() => {
    setValue("company_name", companyInfo.company_name);
  }, [setValue, companyInfo.company_name]);

  useEffect(() => {
    setValue("company_city", companyInfo.company_city);
  }, [setValue, companyInfo.company_city]);

  useEffect(() => {
    setValue("company_zipcode", companyInfo.company_zipcode);
  }, [setValue, companyInfo.company_zipcode]);

  useEffect(() => {
    setValue("company_address", companyInfo.company_address);
  }, [setValue, companyInfo.company_address]);

  return {
    register,
    errors,
    watch,
  };
};

export default useCompanySettings;
