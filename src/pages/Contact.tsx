import CreateContactDialog from "@/components/dialog/CreateContactDialog"
import DeleteContactDialog from "@/components/dialog/DeleteContactDialog"
import EditContactDialog from "@/components/dialog/EditContactDialog"
import ViewContactDialog from "@/components/dialog/ViewContactDialog"
import NavbarSidebar from "@/components/NavbarSidebar"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { contactAtom } from "@/store/atoms"
import { CrossCircledIcon } from "@radix-ui/react-icons"
import { useRecoilState } from "recoil"

function Contact() {
  const [contacts, _] = useRecoilState(contactAtom)
  return (
    <>
      <NavbarSidebar >
        <h1 className="text-3xl font-bold mb-6 text-foreground">Contact Page</h1>
        <div className={`flex justify-start ${contacts && contacts.length === 0 ? "" : "ml-6"}`}>
          <CreateContactDialog />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2  ">
          {contacts && contacts.length === 0 && (
            <div
              className="border-2 border-secondary flex flex-col items-center gap-y-5 col-span-5 justify-center w-full p-20" >
              <CrossCircledIcon className="text-destructive w-20 h-20" />
              <p>No contacts found. Please create a contact.</p>
            </div>
          )}
          {contacts && contacts.length > 0 && contacts.map((contact) => (
            // contact card
            <CardContainer key={contact.id}>
              <CardBody
                className="space-y-1 w-[300px]  border-secondary bg-secondary/10 relative group/card shadow-lg px-10 pt-10 border-2" >
                <CardItem translateZ={80} >
                  <p className="text-lg font-semibold" >{contact.name}</p>
                </CardItem>
                <CardItem translateZ={50}>
                  <p className="text-sm text-muted-foreground" >{contact.email}</p>
                </CardItem>
                <CardItem translateZ={40} >
                  <p className="text-sm text-primary/50" >{contact.phone}</p>
                </CardItem>
                <CardItem translateZ={40} >
                  <div className="flex justify-end " >
                    <ViewContactDialog contact={contact} />
                    <EditContactDialog contact={contact} />
                    <DeleteContactDialog contactId={contact.id} />
                  </div>
                </CardItem>
              </CardBody>
            </CardContainer>

          ))}
        </div>
      </NavbarSidebar>
    </>
  )
}

export default Contact
