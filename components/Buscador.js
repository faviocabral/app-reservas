import React from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

const Buscador = React.memo(({children , open , setOpen , titulo= 'Buscador' })=> {
    const toggle = () => setOpen(!open);
    const customStyles = {
      overlay: {zIndex: 1000}
    };
    
    return (
  
    <Modal isOpen={open} style={customStyles} fade={false} centered={true}>
      <ModalHeader toggle={toggle}>{titulo}</ModalHeader>
      <ModalBody>
        { children }
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={toggle}  >
          Aceptar
        </Button>
        <Button color="secondary" onClick={toggle} >
          Cancel
        </Button>
      </ModalFooter>
    </Modal>

  )
})

// 👇️ set display name
Buscador.displayName = 'Buscador';

export default Buscador