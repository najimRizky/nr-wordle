import { Variant, Variants } from "framer-motion";

interface VariantType extends Variants {
  initial: Variant,
  visible: Variant,
  hidden: Variant,
}

export default VariantType;