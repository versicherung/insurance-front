import React, { useState, useRef } from 'react';
import { Button, message } from 'antd';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
// import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
// import ProDescriptions from '@ant-design/pro-descriptions';
import { PlusOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
// import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';

import { order, exportExcel } from '@/services/api';
// import type { FormValueType } from './components/UpdateForm';
// import UpdateForm from './components/UpdateForm';
/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

// const handleAdd = async (fields: API.RuleListItem) => {
//   const hide = message.loading('正在添加');

//   try {
//     await addRule({ ...fields });
//     hide();
//     message.success('Added successfully');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Adding failed, please try again!');
//     return false;
//   }
// };
/**
 * @en-US Update node
 * @zh-CN 更新节点
 *
 * @param fields
 */

// const handleUpdate = async (fields: FormValueType) => {
//   const hide = message.loading('Configuring');

//   try {
//     await updateRule({
//       name: fields.name,
//       desc: fields.desc,
//       key: fields.key,
//     });
//     hide();
//     message.success('Configuration is successful');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Configuration failed, please try again!');
//     return false;
//   }
// };
/**
 *  Delete node
 * @zh-CN 删除节点
 *
 * @param selectedRows
 */

// const handleRemove = async (selectedRows: API.RuleListItem[]) => {
//   const hide = message.loading('正在删除');
//   if (!selectedRows) return true;

//   try {
//     await removeRule({
//       key: selectedRows.map((row) => row.key),
//     });
//     hide();
//     message.success('Deleted successfully and will refresh soon');
//     return true;
//   } catch (error) {
//     hide();
//     message.error('Delete failed, please try again');
//     return false;
//   }
// };

const handleExportExcel = async (
  formRef: React.MutableRefObject<ProFormInstance | undefined>,
  id?: number[],
) => {
  const params: { startTime?: string; endTime?: string; id?: number[] } = {};
  const hide = message.loading('正在导出');

  // 为导出接口添加参数
  if (formRef.current) {
    const fields = formRef.current.getFieldsValue();
    if (fields.startTime) {
      params.startTime = fields.startTime[0].format('YYYY-MM-DD');
      params.endTime = fields.startTime[1].format('YYYY-MM-DD');
    }
  }
  if (id) {
    params.id = [...id];
  }

  try {
    const res = await exportExcel(params);
    hide();

    const url = window.URL.createObjectURL(res);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'export.xlsx');
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (e) {
    hide();
    message.error('导出文件失败，请稍后重试');
  }
};

const TableList: React.FC = () => {
  // 新建窗口的弹窗
  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  // 分步更新窗口的弹窗
  // const [updateModalVisible, handleUpdateModalVisible]; = useState<boolean>(false);
  // const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  // const [currentRow, setCurrentRow] = useState<API.OrderListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.OrderListItem[]>([]);

  const columns: ProColumns<API.OrderListItem>[] = [
    {
      title: '车主',
      dataIndex: 'owner',
      hideInSearch: true,
      render: (dom) => {
        return (
          <a
            onClick={() => {
              // setCurrentRow(entity);
              // setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '车牌号',
      dataIndex: 'licensePlate',
      hideInSearch: true,
    },
    {
      title: '起保时间',
      dataIndex: 'startTime',
      valueType: 'date',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'startTime',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
    {
      title: '车型',
      dataIndex: 'carType',
      search: false,
    },
    {
      title: '付费方式',
      dataIndex: 'payType',
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a key="downloadFile">下载附件</a>,
        <a
          key="downloadInsurance"
          style={{
            pointerEvents: record.policy ? 'auto' : 'none',
            opacity: record.policy ? 1 : 0.2,
          }}
        >
          下载保单
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.OrderListItem, API.PageParams>
        headerTitle={'顶单列表'}
        actionRef={actionRef}
        formRef={formRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              // handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
          <Button key="out" onClick={() => handleExportExcel(formRef)}>
            导出全部
          </Button>,
        ]}
        request={async (params) => {
          const res = await order(params);

          return {
            success: true,
            data: res.data?.items,
            total: res.data?.total,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择&nbsp;
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>
              &nbsp;项
            </div>
          }
        >
          {/* <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button> */}
          <Button
            type="primary"
            onClick={async () => {
              await handleExportExcel(
                formRef,
                selectedRowsState.map((item) => item.id),
              );
              setSelectedRows([]);
            }}
          >
            批量导出
          </Button>
        </FooterToolbar>
      )}
      {/* <ModalForm
        title={'新建规则'}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: '规则名称为必填项',
            },
          ]}
          width="md"
          name="name"
        />
        <ProFormTextArea width="md" name="desc" />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);

          if (!showDetail) {
            setCurrentRow(undefined);
          }
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

      <Drawer 
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.RuleListItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RuleListItem>[]}
          />
        )}
      </Drawer> */}
    </PageContainer>
  );
};

export default TableList;
