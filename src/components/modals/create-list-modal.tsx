import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"

const CreateListModal = () => {
  return (
    <Dialog>
      <DialogTrigger className="w-full lg:w-fit">
        <Button className="w-full lg:w-fit">Create A List</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogClose />
        </DialogHeader>

        <div>Some form</div>
      </DialogContent>
    </Dialog>
  )
}

export default CreateListModal
