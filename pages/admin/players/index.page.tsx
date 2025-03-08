import {
  Box,
  Flex,
  Heading,
  Button,
  Center,
  Spinner,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Icon,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  HStack,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import React, { ReactElement, useMemo } from "react";
import { NextPageWithLayout } from "@/pages/_app.page";
import AuthLayout from "@/components/AuthLayout/AuthLayout";
import { Link } from "@chakra-ui/react";
import CustomButton from "@/components/CustomButton/CustomButton";
import { FormikHelpers, useFormik } from "formik";
import { AddIcon } from "@chakra-ui/icons";
import { IoIosArrowRoundBack } from "react-icons/io";
import CustomSelect from "@/components/CustomSelect/CustomSelect";
import { Column } from "react-table";

import CustomInput from "@/components/CustomInput/CustomInput";

import CustomTable from "@/components/CustomTable";

import { IPlayer, ITeam } from "@/types/auth";

import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import ErrorLogger from "@/helpers/errorLogger";
import { FileUploader, StorageImage } from "@aws-amplify/ui-react-storage";

const client = generateClient<Schema>();

const Players: NextPageWithLayout = () => {
  const dominantFootlist = [
    {
      value: "Left",
      label: "Left",
    },
    {
      value: "Right",
      label: "Right",
    },
  ];

  const positionList = [
    {
      value: "gk",
      label: "Goalkeeper",
    },
    {
      value: "df",
      label: "Defender",
    },
    {
      value: "cdm",
      label: "Central Defensive Midfielder",
    },
    {
      value: "cm",
      label: "Central Midfielder",
    },
    {
      value: "cam",
      label: "Central Attack Midfielder",
    },
    {
      value: "fw",
      label: "Forward",
    },
  ];

  const initialPlayer = {
    firstName: "",
    lastName: "",
    teamId: "",
    position: undefined,
    playerNumber: undefined,
    dob: "",
    dominantFoot: "",
    height: "",
    weight: "",
    photo: undefined,
  };

  const [allPlayers, setPlayers] = useState<Array<Schema["Player"]["type"]>>(
    []
  );
  const [allTeams, setAllTeams] = useState<Array<Schema["Team"]["type"]>>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [editPlayer, setEditPlayer] = useState<Schema["Player"]["type"]>();

  function listPlayers() {
    setIsLoading(true);
    client.models.Player.observeQuery().subscribe({
      next: (data) => {
        setPlayers([...data.items]);
        setIsLoading(false);
      },
    });
  }

  function listTeams() {
    setIsLoading(true);
    client.models.Team.observeQuery().subscribe({
      next: (data) => {
        setAllTeams([...data.items]);
        setIsLoading(false);
      },
    });
  }

  useEffect(() => {
    listPlayers();
  }, []);

  const columns: Column<IPlayer>[] = useMemo(() => {
    return [
      {
        Header: "Photo",
        accessor: "photo",
        Cell: ({ value }) => (
          <>
            {value ? (
              <StorageImage alt="photo" width={40} path={value} />
            ) : (
              <img src="" alt="photo" />
            )}
          </>
        ),
      },
      {
        Header: "Fullname",
        accessor: "firstName",
        Cell: (value) => (
          <>
            {value.row.original.firstName + " " + value.row.original.lastName}
          </>
        ),
      },
      { Header: "Date of birth", accessor: "dob" },
      { Header: "Player Number", accessor: "playerNumber" },
      { Header: "Height", accessor: "height" },
      { Header: "Weight", accessor: "weight" },
    ];
  }, []);

  const {
    isOpen: isCreatePlayerModalOpen,
    onOpen: onPlayerModalOpen,
    onClose: onCreatePlayerModalClose,
  } = useDisclosure();

  const handleCreatePlayer = async (
    values: IPlayer
    // actions: FormikHelpers<IPlayer>
  ) => {
    // console.log("PLAYER", values);
    if (!values.firstName || !values.lastName || !values.playerNumber) return;

    setIsLoading(true);
    const { data, errors } = await client.models.Player.create({
      firstName: values.firstName,
      lastName: values.lastName,
      teamId: values.teamId,
      position: values.position,
      playerNumber: values.playerNumber,
      dob: values.dob,
      dominantFoot: values.dominantFoot,
      height: values.height,
      weight: values.weight,
      photo: values.photo,
    });

    if (data) onCreatePlayerModalClose();
    if (errors) {
      ErrorLogger(errors);
    }
    setIsLoading(false);
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialPlayer,
    onSubmit: handleCreatePlayer,
  });

  const handleUploadSuccess = (file: { key?: string }) => {
    file?.key && setFieldValue("photo", file.key);
  };

  return (
    <>
      <Box w="full" h="full" pt={[6, 8]}></Box>
      <Box w="full" h="full" py={[4, 6, 8]}>
        <Flex
          align={["flex-start", "center"]}
          justify={["space-between"]}
          direction={["column", "row"]}
          gap={[2, 0]}
          pb={[4, 6]}
        >
          <Link href="/admin/settings">
            <Flex gap={[1]} align="center">
              <Icon
                as={IoIosArrowRoundBack}
                color="iconColor"
                fontSize={["24px"]}
              />
            </Flex>
          </Link>
        </Flex>
        <Flex
          align="center"
          justify={["space-between"]}
          direction={["column", "row"]}
          gap={[2, 0]}
          pb={[4, 6]}
        >
          <Heading>Players</Heading>
          <CustomButton
            onClick={() => {
              onPlayerModalOpen();
              listTeams();
            }}
            height={"48px"}
            minW={["full", "50px"]}
            mt="50px"
          >
            <AddIcon mr="2" fontSize={"12px"} fontWeight={"500"} />
            Add Player
          </CustomButton>
        </Flex>

        <Box h="full" pt={[6, 8]} borderBottomColor="neutral.50">
          {isLoading && (
            <Center>
              <Spinner />
            </Center>
          )}

          {!isLoading && allPlayers.length === 0 && (
            <Center>No players are available</Center>
          )}

          {!isLoading && allPlayers.length > 0 && (
            <CustomTable
              data={allPlayers}
              columns={columns}
              search
              searchPlaceholder="Search for Player"
            />
          )}
        </Box>
      </Box>

      <Modal
        isOpen={isCreatePlayerModalOpen}
        onClose={onCreatePlayerModalClose}
      >
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <ModalHeader>
              {editPlayer ? "Edit Player" : "Create Player"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FileUploader
                acceptedFileTypes={["image/*"]}
                path="media/"
                maxFileCount={1}
                isResumable
                // autoUpload={false}
                onUploadSuccess={handleUploadSuccess}
              />
              <CustomInput
                label="Player's First Name"
                _placeholder="firstName"
                id="firstName"
                inputProps={{
                  onChange: handleChange,
                  onBlur: handleBlur("firstName"),
                }}
                mt={6}
                errorText={
                  errors.firstName && touched.firstName
                    ? errors.firstName
                    : null
                }
              />
              <CustomInput
                label="Player's Last Name"
                _placeholder="lastName"
                id="lastName"
                inputProps={{
                  onChange: handleChange,
                  onBlur: handleBlur("lastName"),
                }}
                mt={6}
                errorText={
                  errors.lastName && touched.lastName ? errors.lastName : null
                }
              />

              <Select
                mt="20px"
                _placeholder="Select Team"
                id="teamId"
                onChange={handleChange}
              >
                {allTeams.length > 0 &&
                  allTeams
                    .filter((team: any) =>
                      team.name.toLowerCase().includes("beyond")
                    )
                    .map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
              </Select>

              <CustomSelect
                mt="20px"
                label="Select Position"
                _placeholder="position"
                selectOptions={positionList.map((i) => ({
                  label: i.label,
                  value: i.value,
                }))}
                selectProps={{
                  onChange: (e) => setFieldValue("position", e),
                }}
              />

              <CustomInput
                label="Player's Number"
                _placeholder="player number"
                id="playerNumber"
                inputProps={{
                  onChange: handleChange,
                  onBlur: handleBlur("playerNumber"),
                  type: "number",
                }}
                mt={6}
                errorText={
                  errors.playerNumber && touched.playerNumber
                    ? errors.playerNumber
                    : null
                }
              />

              <CustomInput
                label="Date of Birth"
                _placeholder="date of birth"
                id="dob"
                inputProps={{
                  onChange: handleChange,
                  onBlur: handleBlur("dob"),
                  type: "date",
                }}
                mt={6}
                errorText={errors.dob && touched.dob ? errors.dob : null}
              />

              <CustomSelect
                mt="20px"
                label="Dominant Foot"
                _placeholder="Dominant Foot"
                selectOptions={dominantFootlist.map((foot) => ({
                  label: foot.label,
                  value: foot.value,
                }))}
                selectProps={{
                  onChange: (e: any) => setFieldValue("dominantFoot", e.value),
                }}
              />

              <CustomInput
                label="Player's Height"
                _placeholder="Player's Height"
                id="height"
                inputProps={{
                  onChange: handleChange,
                  onBlur: handleBlur("height"),
                }}
                mt={6}
                errorText={
                  errors.height && touched.height ? errors.height : null
                }
              />

              <CustomInput
                label="Player's Weight"
                _placeholder="Player's Weight"
                id="weight"
                inputProps={{
                  onChange: handleChange,
                  onBlur: handleBlur("weight"),
                }}
                mt={6}
                errorText={
                  errors.weight && touched.weight ? errors.weight : null
                }
              />
            </ModalBody>

            <ModalFooter>
              <CustomButton type="submit" isLoading={isLoading} w="100%">
                Save Changes
              </CustomButton>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
};

Players.getLayout = function getLayout(page: ReactElement) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Players;
