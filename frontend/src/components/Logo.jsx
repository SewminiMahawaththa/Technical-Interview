
import { LogoName } from "../Content/Text"
import { LogoColors } from "../Content/Colors"

function ProductLogo(){
    return(
        <div>
            <span className={`font-short-stack font-bold text-5xl text-blue-500`}>{LogoName.logoPart1}</span>
            <span className={`font-short-stack font-bold text-5xl text-${LogoColors.color2}`}>{LogoName.logoPart2}</span>
        </div>
    )
}  

export default ProductLogo;
