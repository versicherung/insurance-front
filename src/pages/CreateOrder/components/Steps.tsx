import React, { useState, useRef } from 'react';
import { message } from 'antd';
import { StepsForm, ProFormSelect, ProFormDatePicker, ProFormText } from '@ant-design/pro-form';
import moment from 'moment';

import type { FormInstance } from 'antd';
import {
  billOcr,
  businessOcr,
  certificateOcr,
  drivingOcr,
  idCardOcr,
  otherFile,
} from '@/services/ocr';
import { createOrder } from '@/services/api';
import UploadAliyunOSS from './UploadAliyunOSS';

const handleOCR = async (callback: () => Promise<void>, failCallback: () => void) => {
  const hide = message.loading('正在进行OCR识别', 0);

  try {
    await callback();
    message.info('识别成功');
    hide();
  } catch (e) {
    hide();
    message.error('识别失败');
    failCallback();
  }
};

const Steps: React.FC<{
  current: number;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
  setIsFinish: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ current, setCurrent, setIsFinish }) => {
  const [fileIds, setFileIds] = useState<{
    idCardId: number;
    businessId: number;
    drivingId: number;
    certificateId: number;
    otherFileId: number[];
  }>({
    idCardId: 0,
    businessId: 0,
    drivingId: 0,
    certificateId: 0,
    otherFileId: [],
  });

  const [isIdCard, setIsIdCard] = useState(true);
  const secondRef = useRef<FormInstance>();
  const idCardRef = useRef<any>();
  const businessRef = useRef<any>();
  const [isSecondAfterOcr, setIsSecondAfterOcr] = useState(false);

  const [isDriving, setIsDriving] = useState(true);
  const thirdRef = useRef<FormInstance>();
  const drivingRef = useRef<any>();
  const certificateRef = useRef<any>();
  const [isThirdAfterOcr, setIsThirdAfterOcr] = useState(false);

  const [isPerson, setIsPerson] = useState('none');
  const forthRef = useRef<FormInstance>();
  const billRef = useRef<any>();
  const [billUrl, setBillUrl] = useState('');

  const onFinish = async (value: any) => {
    const data: API.CreateOrderParams = {
      startTime: value.startTime,
      carTypeId: value.carType,
      paymentId: value.payment,
      otherFileId: fileIds.otherFileId,
    };

    if (value.idOrBusiness === 'idCard') {
      data.idCard = {
        id: fileIds.idCardId,
        name: value.name,
        number: value.number,
        address: value.address,
      };
    } else {
      data.businessLicense = {
        id: fileIds.businessId,
        name: value.name,
        number: value.number,
        address: value.address,
      };
    }

    if (value.drivingOrCertificate === 'driving') {
      data.drivingLicense = {
        id: fileIds.drivingId,
        plate: value.plate,
        frame: value.frame,
        engine: value.engine,
        type: value.vehicleType,
      };
    } else {
      data.certificate = {
        id: fileIds.certificateId,
        type: value.vehicleType,
        frame: value.frame,
        engine: value.engine,
      };
    }

    if (value.billType === 'person') {
      data.bill = {
        type: 1,
        phoneNumber: value.billPhoneNumber,
        address: value.billAddress,
      };
    } else if (value.billType === 'company') {
      if (billUrl === '') {
        message.error('请添加专票图片');
        return false;
      }
      data.bill = {
        type: 2,
        phoneNumber: value.billPhoneNumber,
        address: value.billAddress,
        url: billUrl,
        number: value.billNumber,
        bankName: value.billBank,
        account: value.billBankNumber,
        name: value.billName,
      };
    }

    const hide = message.loading('正在创建订单', 0);
    try {
      await createOrder(data);
      hide();
      message.info('订单创建成功');
      setIsFinish(true);
      return true;
    } catch (e) {
      hide();
      message.error('订单创建失败');
      return false;
    }
  };

  return (
    <StepsForm current={current} onCurrentChange={setCurrent} onFinish={onFinish}>
      <StepsForm.StepForm
        title="设置基本信息"
        initialValues={{
          insuranceType: 'newCar',
          startTime: moment().add(1, 'd'),
          payment: 1,
          carType: 1,
        }}
      >
        <ProFormSelect
          label="投保类型"
          width="md"
          name="insuranceType"
          rules={[{ required: true, message: '请选择投保类型' }]}
          valueEnum={{
            newCar: '新车',
            oldCar: '旧车',
          }}
        />

        <ProFormDatePicker
          label="起保日期"
          width="md"
          name="startTime"
          rules={[{ required: true, message: '请选择起保日期' }]}
        />

        <ProFormSelect
          label="付费方式"
          width="md"
          name="payment"
          rules={[{ required: true, message: '请选择付费方式' }]}
          request={async () => [
            { label: '净费', value: 1 },
            { label: '对公', value: 3 },
          ]}
        />

        <ProFormSelect
          label="车辆类型"
          width="md"
          name="carType"
          rules={[{ required: true, message: '请选择车辆类型' }]}
          request={async () => [
            { label: '普通货车', value: 1 },
            { label: '自卸搅拌', value: 2 },
          ]}
        />
      </StepsForm.StepForm>

      <StepsForm.StepForm
        title="上传身份证或营业执照"
        formRef={secondRef}
        initialValues={{
          idOrBusiness: 'idCard',
        }}
        onValuesChange={({ idOrBusiness }) => {
          if (idOrBusiness) {
            idCardRef.current?.setFileList([]);
            businessRef.current?.setFileList([]);

            secondRef.current?.setFieldsValue({
              name: '',
              number: '',
              address: '',
            });
            setIsSecondAfterOcr(false);
            setIsIdCard(idOrBusiness === 'idCard');
          }
        }}
      >
        <ProFormSelect
          label="证件类型"
          width="md"
          name="idOrBusiness"
          rules={[{ required: true, message: '请选择证件类型' }]}
          valueEnum={{
            idCard: '身份证',
            business: '营业执照',
          }}
        />

        {isIdCard ? (
          <>
            <UploadAliyunOSS
              ref={idCardRef}
              namespace="idCard"
              ocrCallback={async (res) => {
                handleOCR(
                  async () => {
                    const ocrRes = await idCardOcr(res.url);
                    const { data } = ocrRes;
                    secondRef.current?.setFieldsValue({
                      name: data?.name,
                      number: data?.number,
                      address: data?.address,
                    });
                    setIsSecondAfterOcr(true);
                    setFileIds((s) => ({
                      ...s,
                      idCardId: data?.id as number,
                    }));
                  },
                  () => {
                    idCardRef.current.setFileList([]);
                  },
                );
              }}
              onRemove={() => {
                secondRef.current?.setFieldsValue({
                  name: '',
                  number: '',
                  address: '',
                });
                setIsSecondAfterOcr(false);
              }}
            />

            <ProFormText
              name="name"
              label="姓名"
              width="md"
              placeholder="请输入姓名"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="number"
              label="身份证号码"
              width="md"
              placeholder="请输入身份证号码"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="address"
              label="住址"
              width="md"
              placeholder="请输入住址"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />
          </>
        ) : (
          <>
            <UploadAliyunOSS
              ref={businessRef}
              namespace="business"
              ocrCallback={async (res) => {
                handleOCR(
                  async () => {
                    const ocrRes = await businessOcr(res.url);
                    const { data } = ocrRes;
                    secondRef.current?.setFieldsValue({
                      name: data?.name,
                      number: data?.number,
                      address: data?.address,
                    });
                    setIsSecondAfterOcr(true);
                    setFileIds((s) => ({
                      ...s,
                      businessId: data?.id as number,
                    }));
                  },
                  () => {
                    businessRef.current.setFileList([]);
                  },
                );
              }}
              onRemove={() => {
                secondRef.current?.setFieldsValue({
                  name: '',
                  number: '',
                  address: '',
                });
                setIsSecondAfterOcr(false);
              }}
            />

            <ProFormText
              name="name"
              label="企业名称"
              width="md"
              placeholder="请输入企业名称"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="number"
              label="统一信用代码"
              width="md"
              placeholder="请输入统一信用代码"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="address"
              label="地址"
              width="md"
              placeholder="请输入地址"
              disabled={!isSecondAfterOcr}
              rules={[{ required: true }]}
            />
          </>
        )}
      </StepsForm.StepForm>

      <StepsForm.StepForm
        title="上传行驶证或车辆合格证"
        formRef={thirdRef}
        initialValues={{
          drivingOrCertificate: 'driving',
        }}
        onValuesChange={({ drivingOrCertificate }) => {
          if (drivingOrCertificate) {
            if (drivingOrCertificate === 'driving') {
              thirdRef.current?.setFieldsValue({
                plate: '',
                vehicleType: '',
                engine: '',
                frame: '',
              });
            } else {
              thirdRef.current?.setFieldsValue({
                engine: '',
                frame: '',
              });
            }

            drivingRef.current?.setFileList([]);
            certificateRef.current?.setFileList([]);

            setIsThirdAfterOcr(false);
            setIsDriving(drivingOrCertificate === 'driving');
          }
        }}
      >
        <ProFormSelect
          label="证件类型"
          width="md"
          name="drivingOrCertificate"
          rules={[{ required: true, message: '请选择证件类型' }]}
          valueEnum={{
            driving: '行驶证',
            certificate: '车辆合格证',
          }}
        />

        {isDriving ? (
          <>
            <UploadAliyunOSS
              ref={drivingRef}
              namespace="driving"
              ocrCallback={async (res) => {
                handleOCR(
                  async () => {
                    const ocrRes = await drivingOcr(res.url);
                    const { data } = ocrRes;
                    thirdRef.current?.setFieldsValue({
                      plate: data?.plate,
                      vehicleType: data?.type,
                      engine: data?.engine,
                      frame: data?.frame,
                    });
                    setIsThirdAfterOcr(true);
                    setFileIds((s) => ({
                      ...s,
                      drivingId: data?.id as number,
                    }));
                  },
                  () => {
                    drivingRef.current.setFileList([]);
                  },
                );
              }}
              onRemove={() => {
                thirdRef.current?.setFieldsValue({
                  plate: '',
                  vehicleType: '',
                  engine: '',
                  frame: '',
                });

                setIsThirdAfterOcr(false);
              }}
            />

            <ProFormText
              name="plate"
              label="车牌号码"
              width="md"
              placeholder="请输入车牌号码"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="vehicleType"
              label="车辆类型"
              width="md"
              placeholder="请输入车辆类型"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="engine"
              label="发动机号"
              width="md"
              placeholder="请输入发动机号"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="frame"
              label="车架号"
              width="md"
              placeholder="请输入车架号"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />
          </>
        ) : (
          <>
            <UploadAliyunOSS
              ref={certificateRef}
              namespace="certificate"
              ocrCallback={async (res) => {
                handleOCR(
                  async () => {
                    const ocrRes = await certificateOcr(res.url);
                    const { data } = ocrRes;
                    thirdRef.current?.setFieldsValue({
                      engine: data?.engine,
                      frame: data?.frame,
                      vehicleType: data?.carType,
                    });
                    setIsThirdAfterOcr(true);
                    setFileIds((s) => ({
                      ...s,
                      certificateId: data?.id as number,
                    }));
                  },
                  () => {
                    certificateRef.current.setFileList([]);
                  },
                );
              }}
              onRemove={() => {
                thirdRef.current?.setFieldsValue({
                  engine: '',
                  frame: '',
                  vehicleType: '',
                });
                setIsThirdAfterOcr(false);
              }}
            />

            <ProFormText
              name="vehicleType"
              label="车辆类型"
              width="md"
              placeholder="请输入车辆类型"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="engine"
              label="发动机号"
              width="md"
              placeholder="请输入发动机号"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />

            <ProFormText
              name="frame"
              label="车架号"
              width="md"
              placeholder="请输入车架号"
              disabled={!isThirdAfterOcr}
              rules={[{ required: true }]}
            />
          </>
        )}
      </StepsForm.StepForm>

      <StepsForm.StepForm
        title="上传发票信息"
        formRef={forthRef}
        initialValues={{
          billType: 'none',
        }}
        onValuesChange={({ billType }) => {
          if (billType) {
            if (billType === 'person') {
              forthRef.current?.setFieldsValue({
                billPhoneNumber: '',
                billAddress: '',
              });
            } else {
              forthRef.current?.setFieldsValue({
                billName: '',
                billNumber: '',
                billAddress: '',
                billPhoneNumber: '',
                billBank: '',
                billBankNumber: '',
              });
              billRef.current?.setFileList([]);
            }

            setIsPerson(billType);
          }
        }}
      >
        <ProFormSelect
          label="发票类型"
          width="md"
          name="billType"
          rules={[{ required: true, message: '请选择发票类型' }]}
          valueEnum={{
            person: '普票',
            company: '专票',
            none: '无',
          }}
        />

        {isPerson === 'person' && (
          <>
            <ProFormText
              name="billPhoneNumber"
              label="电话号码"
              width="md"
              placeholder="请输入电话号码"
              rules={[{ required: true }]}
            />
            <ProFormText
              name="billAddress"
              label="单位地址"
              width="md"
              placeholder="请输入单位地址"
              rules={[{ required: true }]}
            />
          </>
        )}

        {isPerson === 'company' && (
          <>
            <UploadAliyunOSS
              ref={billRef}
              namespace="otherFile"
              ocrCallback={async (res) => {
                setBillUrl(res.url);

                handleOCR(
                  async () => {
                    const ocrRes = await billOcr(res.url);
                    const { data } = ocrRes;
                    forthRef.current?.setFieldsValue({
                      billName: data?.name,
                      billNumber: data?.number,
                      billAddress: data?.address,
                      billPhoneNumber: data?.phoneNumber,
                      billBank: data?.bankName,
                      billBankNumber: data?.bankAccount,
                    });
                  },
                  () => {},
                );
              }}
              onRemove={() => {
                setBillUrl('');

                forthRef.current?.setFieldsValue({
                  billName: '',
                  billNumber: '',
                  billAddress: '',
                  billPhoneNumber: '',
                  billBank: '',
                  billBankNumber: '',
                });
              }}
            />

            <ProFormText
              name="billName"
              label="名称"
              width="md"
              placeholder="请输入名称"
              rules={[{ required: true }]}
            />

            <ProFormText
              name="billNumber"
              label="税号"
              width="md"
              placeholder="请输入税号"
              rules={[{ required: true }]}
            />

            <ProFormText
              name="billAddress"
              label="单位地址"
              width="md"
              placeholder="请输入单位地址"
              rules={[{ required: true }]}
            />

            <ProFormText
              name="billPhoneNumber"
              label="电话号码"
              width="md"
              placeholder="请输入电话号码"
              rules={[{ required: true }]}
            />

            <ProFormText
              name="billBank"
              label="开户银行"
              width="md"
              placeholder="请输入开户银行"
              rules={[{ required: true }]}
            />

            <ProFormText
              name="billBankNumber"
              label="银行账号"
              width="md"
              placeholder="请输入银行账号"
              rules={[{ required: true }]}
            />

            {/* <ProFormText
              name="postAddress"
              label="邮寄地址"
              width="md"
              placeholder="请输入邮寄地址"
              rules={[{ required: true }]}
            /> */}
          </>
        )}
      </StepsForm.StepForm>

      <StepsForm.StepForm title="上传其他材料">
        <UploadAliyunOSS
          namespace="otherFile"
          ocrCallback={async (res) => {
            try {
              const backRes = await otherFile(res.url);
              const { data } = backRes;

              if (data) {
                setFileIds((s) => ({
                  ...s,
                  otherFileId: [...s.otherFileId, data.id],
                }));
              }
            } catch (e) {
              message.error('上传失败请重试！');
            }
          }}
          onRemove={() => {
            setFileIds((s) => ({
              ...s,
              otherFileId: [],
            }));
          }}
        />
      </StepsForm.StepForm>
    </StepsForm>
  );
};

export default Steps;
