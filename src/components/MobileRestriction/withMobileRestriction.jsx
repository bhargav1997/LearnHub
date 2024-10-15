import { useMediaQuery } from "react-responsive";
import MobileRestriction from "./MobileRestriction";

const withMobileRestriction = (WrappedComponent) => {
   const MobileRestrictedComponent = (props) => {
      const isMobile = useMediaQuery({ maxWidth: 767 });

      if (isMobile) {
         return <MobileRestriction />;
      }

      return <WrappedComponent {...props} />;
   };

   MobileRestrictedComponent.displayName = `WithMobileRestriction(${getDisplayName(WrappedComponent)})`;
   return MobileRestrictedComponent;
};

// Helper function to get the display name
const getDisplayName = (WrappedComponent) => {
   return WrappedComponent.displayName || WrappedComponent.name || "Component";
};

export default withMobileRestriction;
