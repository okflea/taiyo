import CreateContactDialog from "@/components/dialog/CreateContactDialog"
import DeleteContactDialog from "@/components/dialog/DeleteContactDialog"
import EditContactDialog from "@/components/dialog/EditContactDialog"
import NavbarSidebar from "@/components/NavbarSidebar"
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card"
import { Button } from "@/components/ui/button"
import { contactAtom } from "@/store/atoms"
import { Pencil2Icon } from "@radix-ui/react-icons"
import { useRecoilState } from "recoil"

function Contact() {
  const [contacts, _] = useRecoilState(contactAtom)
  return (
    <>
      <NavbarSidebar >
        <h1 className="text-3xl font-bold mb-6 text-foreground">Contact Page</h1>
        <div className="flex justify-start">
          <CreateContactDialog />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2  ">
          {contacts && contacts.length === 0 && <p>No contact found</p>}
          {contacts && contacts.length > 0 && contacts.map((contact) => (
            <CardContainer key={contact.id}>
              <CardBody
                className="space-y-1 w-[300px] bg-secondary/10 relative group/card shadow-lg px-10 pt-10 border-2"
              >
                <CardItem
                  translateZ={80}
                >
                  <p
                    className="text-lg font-semibold   "
                  >{contact.name}</p>
                </CardItem>
                <CardItem
                  translateZ={50}
                >
                  <p
                    className="text-sm text-muted-foreground"
                  >{contact.email}</p>
                </CardItem>
                <CardItem
                  translateZ={40}
                >
                  <p
                    className="text-sm text-primary/50"
                  >{contact.phone}</p>
                </CardItem>

                <CardItem
                  translateZ={40}
                >
                  <div
                    className="flex justify-end "
                  >
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
