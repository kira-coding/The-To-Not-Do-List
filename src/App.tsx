import { useState, useEffect, useRef } from "react"
import { Box, Button, Flex, Group, Icon, Input, SimpleGrid } from "@chakra-ui/react"
import { FaPlus, FaTrash } from "react-icons/fa"
import store from "./Helpers/store"
import { FaMinus } from "react-icons/fa"

import { Checkbox } from "./components/ui/checkbox"
export interface TND {
  title: string,
  checked: boolean
}
interface To_Rename {
  old: string,
  title: string
}

function App() {
  let [to_not_do_list, setTo_not_do_list] = useState<TND[]>([]);
  let tnd_input = useRef<HTMLInputElement>(null);

  let [rename, setRename] = useState<To_Rename>({ old: "", title: "" })


  function handleAdd() {
    if (tnd_input.current?.value == undefined || tnd_input.current?.value.length <= 2) return;

    let value = tnd_input.current.value

    let updatedList = [{ title: value, checked: true }, ...to_not_do_list]
    setTo_not_do_list(updatedList)
    tnd_input.current.value = ""
  }

  function handleDeleteTND(_event: any, id: number) {


    let updatedList = to_not_do_list.filter((_NTD, index) => {
      if (id == index) {
        return false
      }
      return true
    })
    setTo_not_do_list(updatedList)


  }

  function handleUpdateTND(_event: any, id: number) {


    let mark: boolean = !to_not_do_list[id].checked
    let updatedList = to_not_do_list.map((tnd, index) => { index == id ? tnd.checked = mark : tnd; return tnd })
    setTo_not_do_list(updatedList)


  }

  function handleRenameTND(e: any, id: number) {
    let new_title = e.target.value
    let old_title = ""
    if (new_title == undefined) return;

    let updated_list = to_not_do_list.map((tnd, index) => {
      if (index == id) {
        old_title = tnd.title
        return { ...tnd, title: new_title }

      }
      return tnd
    }
    )
    setRename({ old: old_title, title: new_title });
    setTo_not_do_list(updated_list)


  }

  async function setup() {

    let TND = await store.entries();
    console.log(TND)
    if (TND.length == 0) { return setTo_not_do_list([]) };
    let checked: TND[] = [];
    let unchecked: TND[] = [];

    TND.forEach((element) => {
      let tnd: TND = { title: "", checked: true }
      tnd.title = element[0]
      tnd.checked = typeof (element[1]) == "boolean" ? element[1] : true
      if (tnd.checked == true)
        checked.push(tnd);
      else {
        unchecked.push(tnd)
      }

    });
    let updated_list = [...unchecked, ...checked]
    setTo_not_do_list(updated_list);



  }

  async function handleReset() {
    await store.reset()
    setTo_not_do_list([])

  }

  useEffect(() => {
    setup()
  }, [])


  useEffect(() => {
    async function update() {
      let data = await store.entries();
      to_not_do_list.forEach(async (tnd) => {

        await store.set(tnd.title, tnd.checked);
        await store.save()

      })
      data.map(async element => {
        let deleted = true
        to_not_do_list.forEach((tnd) => {
          if (tnd.title == element[0]) {
            element[1] = tnd.checked
            deleted = false
            return element
          }
        }
        )
        if (deleted) {
          await store.delete(element[0])
          await store.save()
        }
      }, 200)

    }
    update()
  })

  let handlers = { update: handleUpdateTND, rename: handleRenameTND, delete: handleDeleteTND }

  return (
    <Box height={"100vh"} width={"100vw"} padding={"20px"}>
      <Flex justifyContent={"right"} >
        <Button onClick={handleReset} bgColor={"transparent"} borderWidth={"1px"} borderStyle={"solid"} borderColor={"gray.200"} color={"red.700"} fontSize={"0.5rem"} padding={"1px"}><Icon><FaTrash></FaTrash></Icon></Button>
      </Flex>
      <Flex alignItems={"center"} flexDirection={"column"} >
        <Group marginTop={"15vh"} marginBottom={"4rem"} >

          <Input type="text"
            outline={"none"}
            bgColor={"cyan.900"}
            ref={tnd_input}
            fontFamily={"sans-serif"} onKeyDown={e => {
              if (e.code == "Enter") {
                handleAdd()
              }
              
            }} 
            width={"60vw"}
            fontSize={"1.7rem"} focusRingColor={"cyan.800"}></Input>
          <Button onClick={handleAdd}>
            <Icon><FaPlus></FaPlus></Icon>
          </Button>
        </Group>
        <SimpleGrid gap={"4rem"} padding={"1rem"} minChildWidth={"20rem"} width={"100vw"} columns={{ base: 1, sm: 2, lg: 3 }}>
          {to_not_do_list.map((tnd, index) => {

            return (

              <Group marginBottom={"2rem"} key={index} id={index.toString()} >
                <Checkbox onChange={(e: any) => { handlers.update(e, index) }} checked={tnd.checked}></Checkbox>

                <Input type="text"
                  outline={"none"}
                  bgColor={tnd.checked ? "green.700" : "purple.800"}
                  onKeyDown={e => {
                    if (e.code == "Enter") {
                      handlers.rename(e, index)
                      e.currentTarget?.parentElement?.focus()
                    }
                  }
                  }
                  value={tnd.title}
                  onChange={(e) => { handlers.rename(e, index) }}
                  fontFamily={"sans-serif"} id={index.toString()} width={"100%"} fontSize={"1rem"} padding={'3px'} focusRingColor={"red.700"} />
                {/* <Button>
      <Icon fontSize={"1rem"}><FaPen></FaPen></Icon>
    </Button> */}
                <Button onClick={e => { handlers.delete(e, index) }} id={index.toString()}>
                  <Icon color={"red.700"}><FaMinus></FaMinus></Icon>
                </Button>
              </Group>)
          })}
        </SimpleGrid >
      </Flex>
    </Box>
  )
}

export default App