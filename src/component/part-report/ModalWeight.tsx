import { Button, Form, Input, Modal, FormProps } from 'antd';
import { ValidateNumberOnly } from '../../constants/validate';
import { useEffect, useState } from 'react';
import { DataType } from '../../pages/PartReport';

type Props = {
  isOpen: boolean;
  dataEdit: DataType | null;
  onClose: () => void;
  formControl: FormProps;
  onSave: () => void;
};
export const ModalFormWeight = ({ isOpen, dataEdit, onClose, formControl, onSave }: Props) => {
  const [valueWeight, setValueWeight] = useState<string>('');
  const handleClose = () => {
    onClose?.();
  };
  const onChange = (val: string) => {
    setValueWeight(val);
  };
  useEffect(() => {
    
    setValueWeight(dataEdit?.weight.toString() || '')
    formControl.form?.setFieldValue('weight',dataEdit?.weight)
  },[isOpen, dataEdit])
  return (
    <>
      <Form layout='vertical' form={formControl.form}>
        <Modal
          title={`Weight (kg)`}
          open={isOpen}
          onOk={() => null}
          onCancel={handleClose}
          footer={
            <>
              <Button htmlType='submit' type='default' style={{ background: '#4096ff', color: 'white' }} onClick={onSave}>
                Save
              </Button>
            </>
          }
        >
          <Form.Item label='Weight' name='weight'>
            <Input
              type='text'
              placeholder='input weight'
              value={'123151'}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const { value: inputValue } = e.target;
                if (ValidateNumberOnly(inputValue) || inputValue === '') {
                  onChange?.(inputValue);
                }
              }}
              onKeyDown={(e) => {
                if (!ValidateNumberOnly(e.key)  && e.key !== "Backspace") {
                  e.preventDefault();
                } 
              }}
            />
          </Form.Item>
        </Modal>
      </Form>
    </>
  );
};
