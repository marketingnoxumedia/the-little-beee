import React from 'react';
import {Composition} from 'remotion';
import {StorageVideo, FPS, DURATION_IN_FRAMES, WIDTH, HEIGHT} from './StorageVideo';
import {YahooReel, DURATION_IN_FRAMES as YAHOO_FRAMES} from './YahooReel';
import {CarWashReel, DURATION_IN_FRAMES as CARWASH_FRAMES} from './CarWashReel';
import {AttReel, DURATION_IN_FRAMES as ATT_FRAMES} from './AttReel';
import {OwnershipReel, DURATION_IN_FRAMES as OWNERSHIP_FRAMES} from './OwnershipReel';
import {LaundromatReel, DURATION_IN_FRAMES as LAUNDROMAT_FRAMES} from './LaundromatReel';
import {InflationReel, DURATION_IN_FRAMES as INFLATION_FRAMES} from './InflationReel';
import {SciReel, DURATION_IN_FRAMES as SCI_FRAMES} from './SciReel';
import {CertainReel, DURATION_IN_FRAMES as CERTAIN_FRAMES} from './CertainReel';
import {DragReel, DURATION_IN_FRAMES as DRAG_FRAMES} from './DragReel';
import {MonthsReel, DURATION_IN_FRAMES as MONTHS_FRAMES} from './MonthsReel';
import {MajorReel, DURATION_IN_FRAMES as MAJOR_FRAMES} from './MajorReel';
import {MinimumReel, DURATION_IN_FRAMES as MINIMUM_FRAMES} from './MinimumReel';
import {HeirsReel, DURATION_IN_FRAMES as HEIRS_FRAMES} from './HeirsReel';
import {SafeReel, DURATION_IN_FRAMES as SAFE_FRAMES} from './SafeReel';
import {QuibiReel, DURATION_IN_FRAMES as QUIBI_FRAMES} from './QuibiReel';
import {WasteReel, DURATION_IN_FRAMES as WASTE_FRAMES} from './WasteReel';
import {LifetimeReel, DURATION_IN_FRAMES as LIFETIME_FRAMES} from './LifetimeReel';
import {PestReel, DURATION_IN_FRAMES as PEST_FRAMES} from './PestReel';
import {ParcReel, DURATION_IN_FRAMES as PARC_FRAMES} from './ParcReel';
import {RefundReel, DURATION_IN_FRAMES as REFUND_FRAMES} from './RefundReel';
import {CintasReel, DURATION_IN_FRAMES as CINTAS_FRAMES} from './CintasReel';
import {ToysReel, DURATION_IN_FRAMES as TOYS_FRAMES} from './ToysReel';
import {PayFirstReel, DURATION_IN_FRAMES as PAYFIRST_FRAMES} from './PayFirstReel';
import {VulcanReel, DURATION_IN_FRAMES as VULCAN_FRAMES} from './VulcanReel';
import {SearsReel, DURATION_IN_FRAMES as SEARS_FRAMES} from './SearsReel';
import {FeeReel, DURATION_IN_FRAMES as FEE_FRAMES} from './FeeReel';
import {FastenalReel, DURATION_IN_FRAMES as FASTENAL_FRAMES} from './FastenalReel';
import {QwiksterReel, DURATION_IN_FRAMES as QWIKSTER_FRAMES} from './QwiksterReel';
import {MillionaireReel, DURATION_IN_FRAMES as MILLIONAIRE_FRAMES} from './MillionaireReel';
import {WaterReel, DURATION_IN_FRAMES as WATER_FRAMES} from './WaterReel';
import {CokeReel, DURATION_IN_FRAMES as COKE_FRAMES} from './CokeReel';
import {RatioReel, DURATION_IN_FRAMES as RATIO_FRAMES} from './RatioReel';
import {LabelReel, DURATION_IN_FRAMES as LABEL_FRAMES} from './LabelReel';
import {PhantomReel, DURATION_IN_FRAMES as PHANTOM_FRAMES} from './PhantomReel';
import {AmazonReel, DURATION_IN_FRAMES as AMAZON_FRAMES} from './AmazonReel';
import {BlockbusterReel, DURATION_IN_FRAMES as BLOCK_FRAMES} from './BlockbusterReel';
import {DriftReel, DURATION_IN_FRAMES as DRIFT_FRAMES} from './DriftReel';
import {AwsReel, DURATION_IN_FRAMES as AWS_FRAMES} from './AwsReel';
import {ToyReel, DURATION_IN_FRAMES as TOY_FRAMES} from './ToyReel';
import {SaverReel, DURATION_IN_FRAMES as SAVER_FRAMES} from './SaverReel';
import {MarginReel, DURATION_IN_FRAMES as MARGIN_FRAMES} from './MarginReel';
import {LotteryReel, DURATION_IN_FRAMES as LOTTERY_FRAMES} from './LotteryReel';
import {BottleReel, DURATION_IN_FRAMES as BOTTLE_FRAMES} from './BottleReel';
import {KodakReel, DURATION_IN_FRAMES as KODAK_FRAMES} from './KodakReel';
import {CullReel, DURATION_IN_FRAMES as CULL_FRAMES} from './CullReel';
import {RunwayReel, DURATION_IN_FRAMES as RUNWAY_FRAMES} from './RunwayReel';
import {SpreadReel, DURATION_IN_FRAMES as SPREAD_FRAMES} from './SpreadReel';
import {VendReel, DURATION_IN_FRAMES as VEND_FRAMES} from './VendReel';
import {ExciteReel, DURATION_IN_FRAMES as EXCITE_FRAMES} from './ExciteReel';
import {HoursReel, DURATION_IN_FRAMES as HOURS_FRAMES} from './HoursReel';
import {IndexReel, DURATION_IN_FRAMES as INDEX_FRAMES} from './IndexReel';
import {LeaseReel, DURATION_IN_FRAMES as LEASE_FRAMES} from './LeaseReel';
import {OwnersReel, DURATION_IN_FRAMES as OWNERS_FRAMES} from './OwnersReel';
import {RentReel, DURATION_IN_FRAMES as RENT_FRAMES} from './RentReel';
import {SudsReel, DURATION_IN_FRAMES as SUDS_FRAMES} from './SudsReel';
import {DrawReel, DURATION_IN_FRAMES as DRAW_FRAMES} from './DrawReel';
import {KeepReel, DURATION_IN_FRAMES as KEEP_FRAMES} from './KeepReel';
import {BlackberryReel, DURATION_IN_FRAMES as BLACKBERRY_FRAMES} from './BlackberryReel';
import {SanitationReel, DURATION_IN_FRAMES as SANITATION_FRAMES} from './SanitationReel';
import {ActiveReel, DURATION_IN_FRAMES as ACTIVE_FRAMES} from './ActiveReel';
import {HeadstartReel, DURATION_IN_FRAMES as HEADSTART_FRAMES} from './HeadstartReel';
import {BrandReel, DURATION_IN_FRAMES as BRAND_FRAMES} from './BrandReel';
import {NokiaReel, DURATION_IN_FRAMES as NOKIA_FRAMES} from './NokiaReel';
import {PalletReel, DURATION_IN_FRAMES as PALLET_FRAMES} from './PalletReel';
import {DepreciationReel, DURATION_IN_FRAMES as DEPRECIATION_FRAMES} from './DepreciationReel';
import {GoldReel, DURATION_IN_FRAMES as GOLD_FRAMES} from './GoldReel';
import {BordersReel, DURATION_IN_FRAMES as BORDERS_FRAMES} from './BordersReel';
import {RevenueReel, DURATION_IN_FRAMES as REVENUE_FRAMES} from './RevenueReel';
import {OutputReel, DURATION_IN_FRAMES as OUTPUT_FRAMES} from './OutputReel';
import {GrindReel, DURATION_IN_FRAMES as GRIND_FRAMES} from './GrindReel';
import {PerHourReel, DURATION_IN_FRAMES as PERHOUR_FRAMES} from './PerHourReel';
import {HardestReel, DURATION_IN_FRAMES as HARDEST_FRAMES} from './HardestReel';
import {CapitalReel, DURATION_IN_FRAMES as CAPITAL_FRAMES} from './CapitalReel';
import {StillReel, DURATION_IN_FRAMES as STILL_FRAMES} from './StillReel';
import {ShedReel, DURATION_IN_FRAMES as SHED_FRAMES} from './ShedReel';
import {PaymentReel, DURATION_IN_FRAMES as PAYMENT_FRAMES} from './PaymentReel';
import {NeverstopReel, DURATION_IN_FRAMES as NEVERSTOP_FRAMES} from './NeverstopReel';
import {WonderReel, DURATION_IN_FRAMES as WONDER_FRAMES} from './WonderReel';
import {RallyReel, DURATION_IN_FRAMES as RALLY_FRAMES} from './RallyReel';
import {NumbersReel, DURATION_IN_FRAMES as NUMBERS_FRAMES} from './NumbersReel';
import {SpeedReel, DURATION_IN_FRAMES as SPEED_FRAMES} from './SpeedReel';
import {NestReel, DURATION_IN_FRAMES as NEST_FRAMES} from './NestReel';
import {CeilingReel, DURATION_IN_FRAMES as CEILING_FRAMES} from './CeilingReel';
import {MattressReel, DURATION_IN_FRAMES as MATTRESS_FRAMES} from './MattressReel';
import {GroundReel, DURATION_IN_FRAMES as GROUND_FRAMES} from './GroundReel';
import {UglyReel, DURATION_IN_FRAMES as UGLY_FRAMES} from './UglyReel';
import {ForecastReel, DURATION_IN_FRAMES as FORECAST_FRAMES} from './ForecastReel';
import {PassiveReel, DURATION_IN_FRAMES as PASSIVE_FRAMES} from './PassiveReel';
import {WaitReel, DURATION_IN_FRAMES as WAIT_FRAMES} from './WaitReel';
import {PremiumReel, DURATION_IN_FRAMES as PREMIUM_FRAMES} from './PremiumReel';
import {ThroneReel, DURATION_IN_FRAMES as THRONE_FRAMES} from './ThroneReel';
import {PoolReel, DURATION_IN_FRAMES as POOL_FRAMES} from './PoolReel';
import {NewCarReel, DURATION_IN_FRAMES as NEWCAR_FRAMES} from './NewCarReel';
import {VaultReel, DURATION_IN_FRAMES as VAULT_FRAMES} from './VaultReel';
import {VendorReel, DURATION_IN_FRAMES as VENDOR_FRAMES} from './VendorReel';
import {RealReel, DURATION_IN_FRAMES as REAL_FRAMES} from './RealReel';
import {WantedReel, DURATION_IN_FRAMES as WANTED_FRAMES} from './WantedReel';
import {AutopayReel, DURATION_IN_FRAMES as AUTOPAY_FRAMES} from './AutopayReel';
import {TuitionReel, DURATION_IN_FRAMES as TUITION_FRAMES} from './TuitionReel';
import {LogoStill} from './Logo';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="StorageUnit"
        component={StorageVideo}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="YahooReel"
        component={YahooReel}
        durationInFrames={YAHOO_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="CarWashReel"
        component={CarWashReel}
        durationInFrames={CARWASH_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AttReel"
        component={AttReel}
        durationInFrames={ATT_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="OwnershipReel"
        component={OwnershipReel}
        durationInFrames={OWNERSHIP_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="LaundromatReel"
        component={LaundromatReel}
        durationInFrames={LAUNDROMAT_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="InflationReel"
        component={InflationReel}
        durationInFrames={INFLATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SciReel"
        component={SciReel}
        durationInFrames={SCI_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="CertainReel"
        component={CertainReel}
        durationInFrames={CERTAIN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DragReel"
        component={DragReel}
        durationInFrames={DRAG_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="MonthsReel"
        component={MonthsReel}
        durationInFrames={MONTHS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="MajorReel"
        component={MajorReel}
        durationInFrames={MAJOR_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="MinimumReel"
        component={MinimumReel}
        durationInFrames={MINIMUM_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="HeirsReel"
        component={HeirsReel}
        durationInFrames={HEIRS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SafeReel"
        component={SafeReel}
        durationInFrames={SAFE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="QuibiReel"
        component={QuibiReel}
        durationInFrames={QUIBI_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="WasteReel"
        component={WasteReel}
        durationInFrames={WASTE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="LifetimeReel"
        component={LifetimeReel}
        durationInFrames={LIFETIME_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PestReel"
        component={PestReel}
        durationInFrames={PEST_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ParcReel"
        component={ParcReel}
        durationInFrames={PARC_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="RefundReel"
        component={RefundReel}
        durationInFrames={REFUND_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="CintasReel"
        component={CintasReel}
        durationInFrames={CINTAS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ToysReel"
        component={ToysReel}
        durationInFrames={TOYS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PayFirstReel"
        component={PayFirstReel}
        durationInFrames={PAYFIRST_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="VulcanReel"
        component={VulcanReel}
        durationInFrames={VULCAN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SearsReel"
        component={SearsReel}
        durationInFrames={SEARS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="FeeReel"
        component={FeeReel}
        durationInFrames={FEE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="FastenalReel"
        component={FastenalReel}
        durationInFrames={FASTENAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="QwiksterReel"
        component={QwiksterReel}
        durationInFrames={QWIKSTER_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="MillionaireReel"
        component={MillionaireReel}
        durationInFrames={MILLIONAIRE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="WaterReel"
        component={WaterReel}
        durationInFrames={WATER_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="CokeReel"
        component={CokeReel}
        durationInFrames={COKE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="RatioReel"
        component={RatioReel}
        durationInFrames={RATIO_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="LabelReel"
        component={LabelReel}
        durationInFrames={LABEL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PhantomReel"
        component={PhantomReel}
        durationInFrames={PHANTOM_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AmazonReel"
        component={AmazonReel}
        durationInFrames={AMAZON_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BlockbusterReel"
        component={BlockbusterReel}
        durationInFrames={BLOCK_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DriftReel"
        component={DriftReel}
        durationInFrames={DRIFT_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AwsReel"
        component={AwsReel}
        durationInFrames={AWS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ToyReel"
        component={ToyReel}
        durationInFrames={TOY_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SaverReel"
        component={SaverReel}
        durationInFrames={SAVER_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="MarginReel"
        component={MarginReel}
        durationInFrames={MARGIN_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="LotteryReel"
        component={LotteryReel}
        durationInFrames={LOTTERY_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BottleReel"
        component={BottleReel}
        durationInFrames={BOTTLE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="KodakReel"
        component={KodakReel}
        durationInFrames={KODAK_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="CullReel"
        component={CullReel}
        durationInFrames={CULL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="RunwayReel"
        component={RunwayReel}
        durationInFrames={RUNWAY_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SpreadReel"
        component={SpreadReel}
        durationInFrames={SPREAD_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="VendReel"
        component={VendReel}
        durationInFrames={VEND_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ExciteReel"
        component={ExciteReel}
        durationInFrames={EXCITE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="HoursReel"
        component={HoursReel}
        durationInFrames={HOURS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="IndexReel"
        component={IndexReel}
        durationInFrames={INDEX_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="LeaseReel"
        component={LeaseReel}
        durationInFrames={LEASE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="OwnersReel"
        component={OwnersReel}
        durationInFrames={OWNERS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="RentReel"
        component={RentReel}
        durationInFrames={RENT_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SudsReel"
        component={SudsReel}
        durationInFrames={SUDS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DrawReel"
        component={DrawReel}
        durationInFrames={DRAW_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="KeepReel"
        component={KeepReel}
        durationInFrames={KEEP_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BlackberryReel"
        component={BlackberryReel}
        durationInFrames={BLACKBERRY_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SanitationReel"
        component={SanitationReel}
        durationInFrames={SANITATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ActiveReel"
        component={ActiveReel}
        durationInFrames={ACTIVE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="HeadstartReel"
        component={HeadstartReel}
        durationInFrames={HEADSTART_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BrandReel"
        component={BrandReel}
        durationInFrames={BRAND_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="NokiaReel"
        component={NokiaReel}
        durationInFrames={NOKIA_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PalletReel"
        component={PalletReel}
        durationInFrames={PALLET_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="DepreciationReel"
        component={DepreciationReel}
        durationInFrames={DEPRECIATION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="GoldReel"
        component={GoldReel}
        durationInFrames={GOLD_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="BordersReel"
        component={BordersReel}
        durationInFrames={BORDERS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="RevenueReel"
        component={RevenueReel}
        durationInFrames={REVENUE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="OutputReel"
        component={OutputReel}
        durationInFrames={OUTPUT_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="GrindReel"
        component={GrindReel}
        durationInFrames={GRIND_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PerHourReel"
        component={PerHourReel}
        durationInFrames={PERHOUR_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="HardestReel"
        component={HardestReel}
        durationInFrames={HARDEST_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="CapitalReel"
        component={CapitalReel}
        durationInFrames={CAPITAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="StillReel"
        component={StillReel}
        durationInFrames={STILL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ShedReel"
        component={ShedReel}
        durationInFrames={SHED_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PaymentReel"
        component={PaymentReel}
        durationInFrames={PAYMENT_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="NeverstopReel"
        component={NeverstopReel}
        durationInFrames={NEVERSTOP_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="WonderReel"
        component={WonderReel}
        durationInFrames={WONDER_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="RallyReel"
        component={RallyReel}
        durationInFrames={RALLY_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="NumbersReel"
        component={NumbersReel}
        durationInFrames={NUMBERS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="SpeedReel"
        component={SpeedReel}
        durationInFrames={SPEED_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="NestReel"
        component={NestReel}
        durationInFrames={NEST_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="CeilingReel"
        component={CeilingReel}
        durationInFrames={CEILING_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="MattressReel"
        component={MattressReel}
        durationInFrames={MATTRESS_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="GroundReel"
        component={GroundReel}
        durationInFrames={GROUND_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="UglyReel"
        component={UglyReel}
        durationInFrames={UGLY_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ForecastReel"
        component={ForecastReel}
        durationInFrames={FORECAST_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PassiveReel"
        component={PassiveReel}
        durationInFrames={PASSIVE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="WaitReel"
        component={WaitReel}
        durationInFrames={WAIT_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PremiumReel"
        component={PremiumReel}
        durationInFrames={PREMIUM_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="ThroneReel"
        component={ThroneReel}
        durationInFrames={THRONE_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="PoolReel"
        component={PoolReel}
        durationInFrames={POOL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="NewCarReel"
        component={NewCarReel}
        durationInFrames={NEWCAR_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="VaultReel"
        component={VaultReel}
        durationInFrames={VAULT_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="VendorReel"
        component={VendorReel}
        durationInFrames={VENDOR_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="RealReel"
        component={RealReel}
        durationInFrames={REAL_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="WantedReel"
        component={WantedReel}
        durationInFrames={WANTED_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="AutopayReel"
        component={AutopayReel}
        durationInFrames={AUTOPAY_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="TuitionReel"
        component={TuitionReel}
        durationInFrames={TUITION_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      {/* Utility comp: render to a transparent PNG for the watermark. */}
      <Composition id="Logo" component={LogoStill} durationInFrames={1} fps={30} width={800} height={200} />
    </>
  );
};
