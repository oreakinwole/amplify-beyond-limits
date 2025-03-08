import { ReactElement, useEffect, useState } from "react";
import PlayerModal from "@/components/Players/PlayerModal";
import styles from "./Team.module.css";
import GuestLayout from "@/components/GuestLayout/GuestLayout";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { StorageImage } from "@aws-amplify/ui-react-storage";
import { Spinner, Center } from "@chakra-ui/react";

const client = generateClient<Schema>();

const Under19Team = () => {
  const [allPlayers, setPlayers] = useState<Array<Schema["Player"]["type"]>>(
    []
  );

  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  function listPlayers() {
    setIsLoading(true);
    client.models.Player.observeQuery().subscribe({
      next: (data) => {
        setPlayers([...data.items]);
        setIsLoading(false);
      },
    });
  }

  const openModal = (player: any) => {
    setSelectedPlayer(player);
  };

  const closeModal = () => {
    setSelectedPlayer(null);
  };

  useEffect(() => {
    listPlayers();
  }, []);

  return (
    <div className="mainContainer">
      <div
        className={styles.teamHead}
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(4, 48, 91, 54%), rgba(64, 84, 102, 27%)), url(/images/under19-cover.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "top",
        }}
      >
        <h1>UNDER 19 PLAYERS</h1>
      </div>
      {/* {isLoading && (
                  <Center>
                    <Spinner />
                  </Center>
                  )} */}
      <div className={styles.teamInfo}>
        <div className={styles.teamPosition}>
          <h2>Goalkeepers</h2>
          <ul className={styles.playerList}>
            {allPlayers
              .filter((player) => player?.position?.label === "Goalkeeper")
              .map((player) => (
                <li key={player.id} className={styles.playerCard}>
                  {player.photo && (
                    <div className={styles.playerImage}>
                      <StorageImage
                        alt="photo"
                        height={"100%"}
                        path={player.photo}
                      />
                    </div>
                  )}

                  <div className={styles.playerDetails}>
                    <div className={styles.playerName}>
                      <p className={styles.playerFirstName}>
                        {player.firstName}
                      </p>
                      <p className={styles.playerLastName}>{player.lastName}</p>
                    </div>
                    <div className={styles.ProfileLink}>
                      <button
                        className={styles.playerProfileLink}
                        onClick={() => openModal(player)}
                      >
                        View Profile →
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className={styles.teamPosition}>
          <h2>Defenders</h2>
          <ul className={styles.playerList}>
            {allPlayers
              .filter((player) => player?.position?.label === "Defender")
              .map((player) => (
                <li key={player.id} className={styles.playerCard}>
                  {player.photo && (
                    <div className={styles.playerImage}>
                      <StorageImage
                        alt="photo"
                        height={"100%"}
                        path={player.photo}
                      />
                    </div>
                  )}

                  <div className={styles.playerDetails}>
                    <div className={styles.playerName}>
                      <p className={styles.playerFirstName}>
                        {player.firstName}
                      </p>
                      <p className={styles.playerLastName}>{player.lastName}</p>
                    </div>
                    <div className={styles.ProfileLink}>
                      <button
                        className={styles.playerProfileLink}
                        onClick={() => openModal(player)}
                      >
                        View Profile →
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className={styles.teamPosition}>
          <h2>Midfielders</h2>
          <ul className={styles.playerList}>
            {allPlayers
              .filter((player) =>
                player?.position?.label?.includes("Midfielder")
              )
              .map((player) => (
                <li key={player.id} className={styles.playerCard}>
                  {player.photo && (
                    <div className={styles.playerImage}>
                      <StorageImage
                        alt="photo"
                        height={"100%"}
                        path={player.photo}
                      />
                    </div>
                  )}
                  <div className={styles.playerDetails}>
                    <div className={styles.playerName}>
                      <p className={styles.playerFirstName}>
                        {player.firstName}
                      </p>
                      <p className={styles.playerLastName}>{player.lastName}</p>
                    </div>
                    <div className={styles.ProfileLink}>
                      <button
                        className={styles.playerProfileLink}
                        onClick={() => openModal(player)}
                      >
                        View Profile →
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>

        <div className={styles.teamPosition}>
          <h2>Forwards</h2>
          <ul className={styles.playerList}>
            {allPlayers
              .filter((player) => player?.position?.label?.includes("Forward"))
              .map((player) => (
                <li key={player.id} className={styles.playerCard}>
                  {player.photo && (
                    <div className={styles.playerImage}>
                      <StorageImage
                        alt="photo"
                        height={"100%"}
                        path={player.photo}
                      />
                    </div>
                  )}
                  <div className={styles.playerDetails}>
                    <div className={styles.playerName}>
                      <p className={styles.playerFirstName}>
                        {player.firstName}
                      </p>
                      <p className={styles.playerLastName}>{player.lastName}</p>
                    </div>
                    <div className={styles.ProfileLink}>
                      <button
                        className={styles.playerProfileLink}
                        onClick={() => openModal(player)}
                      >
                        View Profile →
                      </button>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>

      {/* Add similar sections for other positions */}

      {selectedPlayer && (
        <PlayerModal player={selectedPlayer} onClose={closeModal} />
      )}
    </div>
  );
};
Under19Team.getLayout = function getLayout(page: ReactElement) {
  return <GuestLayout>{page}</GuestLayout>;
};

export default Under19Team;
