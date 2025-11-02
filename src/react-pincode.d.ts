// react-pincode.d.ts
declare module 'react-pincode' {
  import { ComponentType } from 'react';
  
  interface PincodeProps {
    selectedPincodes: string[];
    setSelectedPincodes: (pincodes: string[]) => void;
    showArea?: boolean;
    className?: string;
    // Add other props if needed based on the library's documentation
  }
  
  const Pincode: ComponentType<PincodeProps>;
  export default Pincode;
}