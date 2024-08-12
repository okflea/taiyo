import { UserAtom } from "@/atoms";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateUpgradeBenefit, calculateUpgradeCost } from "@/lib/utils";
import { socket } from "@/socket";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { toast } from "sonner";

const BASEMONKEYCOST = 100;
const BASEMONKEYBENEFIT = 1;
const BASELABCOST = 50;
const BASELABBENEFIT = 2;
const GROWTHFACTOR = 1.2;

const Play = () => {
  const [user, setUser] = useRecoilState(UserAtom)
  const [bananas, setBananas] = useState<number>(user?.bananas || 0);
  const [clickIncrement, setClickIncrement] = useState<number>(1);
  const { data, isPending, refetch } = useQuery({
    queryKey: ["upgrades"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/upgrade`)
      if (response.status === 200) {
        response.data.map((upgrade: any) => {
          if (upgrade.type === "MONKEY") {
            upgrade.cost = calculateUpgradeCost(BASEMONKEYCOST, upgrade.level, GROWTHFACTOR)
            upgrade.benefit = calculateUpgradeBenefit(BASEMONKEYBENEFIT, upgrade.level,)
          } else if (upgrade.type === "LAB") {
            upgrade.cost = calculateUpgradeCost(BASELABCOST, upgrade.level, GROWTHFACTOR)
            upgrade.benefit = calculateUpgradeBenefit(BASELABBENEFIT, upgrade.level,)
            setClickIncrement(upgrade.benefit)
          }
        })
      }
      return response.data
    }
  })
  const handleClick = () => {
    setBananas(prev => prev + clickIncrement)
    setUser(prev => prev && {
      ...prev,
      bananas: prev.bananas + clickIncrement,
      score: prev.score + clickIncrement
    })
    if (user) {
      socket.emit('updateScore', { userId: user.id, inc: clickIncrement });
    }
  };
  const [isLoading, setIsLoading] = useState(false);
  const handleUpgrade = async ({
    id: upgradeId,
    type: upgradeType,
    // level: currentLevel,
    cost,
    benefit
  }: {
    id: string;
    type: "MONKEY" | "LAB";
    level: number;
    cost: number;
    benefit: number;
  }) => {
    setIsLoading(true);
    // const cost = calculateUpgradeCost(upgradeType === "MONKEY" ? BASEMONKEYCOST : BASELABCOST, currentLevel, GROWTHFACTOR);
    if (bananas < cost) {
      toast.error("Not enough bananas");
      return;
    }
    try {
      const response = await axios.patch(`${import.meta.env.VITE_BACKEND_URL}/api/upgrade/${upgradeId}`, { cost });
      if (response.status === 200) {
        toast.success("Upgrade purchased");
        setBananas(prev => prev - cost);
        setUser(prev => prev && {
          ...prev,
          bananas: prev.bananas - cost
        })
        refetch();
        if (upgradeType === "LAB") {
          setClickIncrement(prev => prev + benefit);
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    return () => {
    };
  }, []);

  return <>
    <div className="flex items-center justify-center p-10">
      {/* container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-[1500px] w-full">


        {/* box */}


        <CardContainer>
          <CardBody
            className="space-y-4 border-2 border-primary shadow-lg p-10 h-[300px] w-[500px]  mx-auto"
          >
            <CardItem
              translateZ={20}
            >
              <h1 className="text-4xl font-semibold text-center font-nabla dark:gradient-heading">
                Banana Bonanza
              </h1>
            </CardItem>
            <CardItem
              translateZ={40}
            >
              <Button
                className="w-full text-2xl h-14 bg-gradient-to-r from-secondary to-secondary/90 transition duration-150 ease-in-out active:scale-95 active:from-primary active:to-primary/50"
                onClick={handleClick}>🍌{clickIncrement > 1 ? ` x ${clickIncrement}` : ""}</Button>
            </CardItem>
            <CardItem
              translateZ={60}
            >
              <p className="text-3xl font-bold text-center text-primary light:text-black">Bananas : {bananas}</p>
            </CardItem>
          </CardBody>
        </CardContainer>


        {/* <div className="h-[300px] border-2 border-primary shadow-lg p-10 flex flex-col gap-y-8 max-w-[500px] w-full mx-auto"> */}
        {/*   <h1 className="text-5xl font-semibold text-center font-nabla dark:gradient-heading"> */}
        {/*     Banana Bonanza */}
        {/*   </h1> */}
        {/*   <Button */}
        {/*     className="text-2xl h-14 bg-gradient-to-r from-secondary to-secondary/90 transition duration-150 ease-in-out active:scale-95 active:from-primary active:to-primary/50" */}
        {/*     onClick={handleClick}>🍌</Button> */}
        {/*   <p className="text-3xl font-bold text-center text-primary light:text-black">Bananas : {bananas}</p> */}
        {/* </div> */}

        {isPending && (
          <>
            <Skeleton className=" shadow-lg h-[300px] max-w-[500px] w-full mx-auto" />
            <Skeleton className=" shadow-lg h-[300px] max-w-[500px] w-full mx-auto" />
          </>
        )}
        {!isPending && data && data.map((upgrade: { id: string; type: "MONKEY" | "LAB"; level: number; cost: number; benefit: number }) => {
          // const cost = calculateUpgradeCost(upgrade.type === "MONKEY" ? BASEMONKEYCOST : BASELABCOST, upgrade.level, GROWTHFACTOR);
          // const benefit = calculateUpgradeBenefit(upgrade.type === "MONKEY" ? BASEMONKEYBENEFIT : BASELABBENEFIT, upgrade.level + 1);

          return (
            <CardContainer key={upgrade.id}>
              <CardBody
                className={`border-2 border-primary shadow-lg p-10 h-[300px] w-[500px] space-y-4 mx-auto ${upgrade.level === 0 && "border-dashed opacity-85"}`}
              >
                <CardItem
                  translateZ={80}
                >
                  <h1 className={`text-center text-2xl font-semibold ${upgrade.type === "MONKEY" ? "text-orange-900" : "text-green-600"}`}>
                    {upgrade.type === "MONKEY" ? "Monkey Business 🐒" : "Banana Steroid Lab 💪🏾"}
                  </h1>
                </CardItem>

                {upgrade.level > 0 && (

                  <CardItem
                    translateZ={20}
                  >
                    <p className="font-semibold text-blue-400">Level {upgrade.level} {upgrade.type === "MONKEY" ? "Monkey" : "Lab"}</p>
                  </CardItem>

                )}
                <CardItem
                  translateZ={90}
                >
                  <Button
                    className="mt-4 w-full"
                    disabled={bananas < upgrade.cost || isLoading}
                    onClick={() => handleUpgrade(upgrade)}
                  >
                    {bananas < upgrade.cost ? `Unlocks after ${upgrade.cost} bananas` : `Upgrade for ${upgrade.cost} bananas`}
                  </Button>
                </CardItem>
                <CardItem
                  translateZ={20}
                >

                  <p className="font-light">
                    {upgrade.type === "MONKEY" ? `Hires monkeys to collect ${upgrade.benefit} banana${upgrade.benefit > 1 ? "s" : ""} per 10 seconds` : `Injects bananas with growth hormones. ${upgrade.benefit} bananas per click`}</p>
                </CardItem>

              </CardBody>
            </CardContainer>

          );
        })}
      </div>
    </div>

  </>;
};

export default Play;
