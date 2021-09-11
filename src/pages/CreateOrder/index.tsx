import React, { useState, useEffect, useRef } from 'react';
import { Card, Result, Alert } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';

import Steps from './components/Steps';
import StepResult from './components/StepResult';

const CreateOrder: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [isFinish, setIsFinish] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [tip, setTip] = useState('');
  const [showError, setShowError] = useState(false);
  const timer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    function func() {
      const now = moment();
      const ofEnd = moment().endOf('day');
      const ofStart = moment().set('hour', 17).set('minute', 45).set('second', 0);
      const tipStart = moment().set('hour', 17).set('minute', 30).set('second', 0);

      if (now.isAfter(ofStart) && now.isBefore(ofEnd)) {
        setShowError(true);
        setShowTip(false);
        return func;
      }

      if (now.isAfter(tipStart) && now.isBefore(ofStart)) {
        setShowError(false);
        setShowTip(true);

        const duration = moment.duration(ofStart.diff(now));
        setTip(`${duration.get('minutes')}分${duration.get('seconds')}秒`);
      }

      return func;
    }

    timer.current = setInterval(func(), 1000);

    return () => {
      if (timer.current) {
        clearInterval(timer.current);
      }
    };
  }, []);

  const content =
    isFinish === false ? (
      <Steps current={current} setCurrent={setCurrent} setIsFinish={setIsFinish} />
    ) : (
      <StepResult
        onFinish={() => {
          setCurrent(0);
          setIsFinish(false);
        }}
      />
    );

  return (
    <PageContainer content="创建一个保险单">
      <Card bordered={false}>
        {showError ? (
          <Result
            status="error"
            title="不在可用时间内"
            subTitle="只能在每天的0点到17点45分之间创建订单"
          />
        ) : (
          <>
            {showTip ? (
              <Alert
                style={{
                  marginBottom: '20px',
                }}
                message={`时间还剩余${tip}`}
                type="warning"
                showIcon
              />
            ) : null}

            {content}
          </>
        )}
      </Card>
    </PageContainer>
  );
};

export default CreateOrder;
