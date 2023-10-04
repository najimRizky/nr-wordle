import VariantType from "@/types/VariantType"
import { Variant, Variants } from "framer-motion"

export const baseMenuVariant: VariantType = {
  initial: {
    x: 100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    }
  },
  hidden: {
    x: 100,
    opacity: 0,
    transition: {
      duration: 0.5,
    }
  }
}

export const selectLevelMenuVariant: VariantType = {
  initial: {
    x: 100,
    opacity: 0,
    visibility: "hidden"
  },
  visible: {
    x: 0,
    opacity: 1,
    visibility: "visible",
    transition: {
      duration: 0.5,
      delay: 0.5,
      type: "tween"
    }
  },
  hidden: {
    x: 100,
    opacity: 0,
    visibility: "hidden",
    transition: {
      duration: 0.5,
      type: "tween"
    }
  }
}