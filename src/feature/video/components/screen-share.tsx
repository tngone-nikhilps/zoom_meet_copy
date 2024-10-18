import React from 'react';
import { Button, Tooltip, Menu, Dropdown } from 'antd';
import classNames from 'classnames';
import { IconFont } from '../../../component/icon-font';
import { LockOutlined, UnlockOutlined, UpOutlined, CheckOutlined } from '@ant-design/icons';
import { SharePrivilege } from '@zoom/videosdk';
import { getAntdDropdownMenu, getAntdItem } from './video-footer-utils';

const { Button: DropdownButton } = Dropdown;
interface ScreenShareButtonProps {
  sharePrivilege: SharePrivilege;
  isHostOrManager: boolean;
  onSharePrivilegeClick?: (privilege: SharePrivilege) => void;
  onScreenShareClick: () => void;
}

interface ScreenShareLockButtonProps {
  isLockedScreenShare: boolean;
  onScreenShareLockClick: () => void;
}

const ScreenShareButton = (props: ScreenShareButtonProps) => {
  const { sharePrivilege, isHostOrManager, onScreenShareClick, onSharePrivilegeClick } = props;
  const menu = [
    getAntdItem(
      'Lock share',
      `${SharePrivilege.Locked}`,
      sharePrivilege === SharePrivilege.Locked && <CheckOutlined />
    ),
    getAntdItem(
      'One participant can share at a time',
      `${SharePrivilege.Unlocked}`,
      sharePrivilege === SharePrivilege.Unlocked && <CheckOutlined />
    ),
    getAntdItem(
      'Multiple participants can share simultaneously',
      `${SharePrivilege.MultipleShare}`,
      sharePrivilege === SharePrivilege.MultipleShare && <CheckOutlined />
    )
  ];
  const onMenuItemClick = (payload: { key: any }) => {
    onSharePrivilegeClick?.(Number(payload.key));
  };
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <>
      <button
        className=" flex justify-center relative items-center h-[3.75rem] w-[3.75rem] bg-[#1B3728] rounded-full"
        onClick={onScreenShareClick}
      >
        <IconFont type="icon-share" />
      </button>
    </>
  );
};

const ScreenShareLockButton = (props: ScreenShareLockButtonProps) => {
  const { isLockedScreenShare, onScreenShareLockClick } = props;
  return (
    <Tooltip title={isLockedScreenShare ? 'unlock screen share' : ' lock screen share'}>
      <Button
        className="screen-share-button"
        icon={isLockedScreenShare ? <LockOutlined /> : <UnlockOutlined />}
        // eslint-disable-next-line react/jsx-boolean-value
        ghost={true}
        shape="circle"
        size="large"
        onClick={onScreenShareLockClick}
      />
    </Tooltip>
  );
};

export { ScreenShareButton, ScreenShareLockButton };
