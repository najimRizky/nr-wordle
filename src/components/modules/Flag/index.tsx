import Flags from 'country-flag-icons/react/3x2'
import { FlagProps, NoFlagProps } from './interface';

const Flag = ({ countryCode, size = 32 }: FlagProps) => {
  if (!countryCode) {
    return <NoFlag width={size} />;
  }

  const getFlag = () => {
    const currentFlag = Flags[countryCode?.toUpperCase() as keyof typeof Flags];
    if (!currentFlag) {
      return NoFlag
    }

    const FixFlag: any = Flags[countryCode?.toUpperCase() as keyof typeof Flags];
    return FixFlag;
  }

  const FlagComponent: any = getFlag();
  return <FlagComponent width={size} />;
};

export default Flag;

const NoFlag = ({ width }: NoFlagProps) => (
  <div style={{ width: width, height: width / 1.5 }}>
    <div className="w-full h-full flex justify-center items-center bg-gray-300 font-bold"> ? </div>
  </div>
)