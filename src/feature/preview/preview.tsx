import React, { useCallback, useState, useRef, useEffect } from 'react';
import ZoomVideo, { TestMicrophoneReturn, TestSpeakerReturn } from '@zoom/videosdk';
import { useMount, useUnmount } from '../../hooks';
import './preview.scss';
import MicrophoneButton from '../video/components/microphone';
import CameraButton from '../video/components/camera';
import { message, Button, Progress, Select } from 'antd';
import { MediaDevice } from '../video/video-types';
import classNames from 'classnames';
import { RouteComponentProps, useHistory } from 'react-router-dom';
interface PreviewProps extends RouteComponentProps {
  joinSession: () => void;
}
// label: string;
// deviceId: string;
let prevMicFeedbackStyle = '';
let micFeedBackInteval: any = '';

let localAudio = ZoomVideo.createLocalAudioTrack();
let localVideo = ZoomVideo.createLocalVideoTrack();
let allDevices;

const mountDevices: () => Promise<{
  mics: MediaDevice[];
  speakers: MediaDevice[];
  cameras: MediaDevice[];
}> = async () => {
  allDevices = await ZoomVideo.getDevices();
  const cameraDevices: Array<MediaDeviceInfo> = allDevices.filter((device) => {
    return device.kind === 'videoinput';
  });
  const micDevices: Array<MediaDeviceInfo> = allDevices.filter((device) => {
    return device.kind === 'audioinput';
  });
  const speakerDevices: Array<MediaDeviceInfo> = allDevices.filter((device) => {
    return device.kind === 'audiooutput';
  });
  return {
    mics: micDevices.map((item) => {
      return { label: item.label, deviceId: item.deviceId };
    }),
    speakers: speakerDevices.map((item) => {
      return { label: item.label, deviceId: item.deviceId };
    }),
    cameras: cameraDevices.map((item) => {
      return { label: item.label, deviceId: item.deviceId };
    })
  };
};

const updateMicFeedbackStyle = () => {
  const newVolumeIntensity = localAudio.getCurrentVolume();
  let newMicFeedbackStyle = '';

  if (newVolumeIntensity === 0) {
    newMicFeedbackStyle = '';
  } else if (newVolumeIntensity <= 0.05) {
    newMicFeedbackStyle = 'mic-feedback__very-low';
  } else if (newVolumeIntensity <= 0.1) {
    newMicFeedbackStyle = 'mic-feedback__low';
  } else if (newVolumeIntensity <= 0.15) {
    newMicFeedbackStyle = 'mic-feedback__medium';
  } else if (newVolumeIntensity <= 0.2) {
    newMicFeedbackStyle = 'mic-feedback__high';
  } else if (newVolumeIntensity <= 0.25) {
    newMicFeedbackStyle = 'mic-feedback__very-high';
  } else {
    newMicFeedbackStyle = 'mic-feedback__max';
  }
  const micIcon: any = document.getElementById('auido-volume-feedback');
  if (prevMicFeedbackStyle !== '' && micIcon) {
    micIcon.classList.toggle(prevMicFeedbackStyle);
  }

  if (newMicFeedbackStyle !== '' && micIcon) {
    micIcon.classList.toggle(newMicFeedbackStyle);
  }
  console.log(newMicFeedbackStyle, newVolumeIntensity);
  prevMicFeedbackStyle = newMicFeedbackStyle;
};

const { Option } = Select;

const PreviewContainer: React.FunctionComponent<PreviewProps> = (props: any) => {
  const { joinSession } = props;
  const history = useHistory();

  const [isStartedAudio, setIsStartedAudio] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isStartedVideo, setIsStartedVideo] = useState<boolean>(false);
  const [micList, setMicList] = useState<MediaDevice[]>([]);
  const [speakerList, setSpeakerList] = useState<MediaDevice[]>([]);
  const [cameraList, setCameraList] = useState<MediaDevice[]>([]);
  const [activeMicrophone, setActiveMicrophone] = useState('');
  const [activeSpeaker, setActiveSpeaker] = useState('');
  const [activeCamera, setActiveCamera] = useState('');
  const [outputLevel, setOutputLevel] = useState(0);
  const [inputLevel, setInputLevel] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [isPlayingRecording, setIsPlayingRecording] = useState(false);
  const [isInVBMode, setIsInVBMode] = useState(false);
  const [isBlur, setIsBlur] = useState(false);
  const speakerTesterRef = useRef<TestSpeakerReturn>();
  const microphoneTesterRef = useRef<TestMicrophoneReturn>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    startAudio();
  }, []);
  const startAudio = async () => {
    await localAudio?.start();
    setIsStartedAudio(true);
  };
  const onCameraClick = useCallback(async () => {
    if (isStartedVideo) {
      await localVideo?.stop();
      setIsStartedVideo(false);
      setIsInVBMode(false);
      setIsBlur(false);
    } else {
      if (videoRef.current) {
        await localVideo?.start(videoRef.current);
        setIsStartedVideo(true);
      }
    }
  }, [isStartedVideo]);
  const onMicrophoneClick = useCallback(async () => {
    if (isStartedAudio) {
      if (isMuted) {
        await localAudio?.unmute();
        micFeedBackInteval = setInterval(updateMicFeedbackStyle, 500);
        setIsMuted(false);
      } else {
        await localAudio?.mute();
        if (micFeedBackInteval) {
          clearInterval(micFeedBackInteval);
        }
        setIsMuted(true);
      }
    } else {
      await localAudio?.start();
      setIsStartedAudio(true);
    }
  }, [isStartedAudio, isMuted]);
  const onMicrophoneMenuClick = async (key: string) => {
    const [type, deviceId] = key.split('|');
    if (type === 'microphone') {
      if (deviceId !== activeMicrophone) {
        await localAudio.stop();
        setIsMuted(true);
        localAudio = ZoomVideo.createLocalAudioTrack(deviceId);
        await localAudio.start();
        setActiveMicrophone(deviceId);
      }
    } else if (type === 'leave audio') {
      await localAudio.stop();
      setIsStartedAudio(false);
    }
  };
  const onSwitchCamera = async (key: string) => {
    if (localVideo) {
      if (activeCamera !== key) {
        await localVideo.switchCamera(key);
      }
    }
  };
  const onBlurBackground = useCallback(async () => {
    if (isInVBMode) {
      if (isBlur) {
        await localVideo.updateVirtualBackground(undefined);
      } else {
        await localVideo.updateVirtualBackground('blur');
      }
      setIsBlur(!isBlur);
    } else {
      if (!isBlur) {
        localVideo.stop();
        if (canvasRef.current) {
          localVideo.start(canvasRef.current, { imageUrl: 'blur' });
        }
        setIsInVBMode(true);
        setIsBlur(!isBlur);
      }
    }
  }, [isInVBMode, isBlur]);
  useMount(() => {
    mountDevices().then((devices) => {
      setMicList(devices.mics);
      setCameraList(devices.cameras);
      setSpeakerList(devices.speakers);
      if (devices.speakers.length > 0) {
        setActiveSpeaker(devices.speakers[0].deviceId);
      }
      if (devices.mics.length > 0) {
        setActiveMicrophone(devices.mics[0].deviceId);
      }
    });
  });
  const onTestSpeakerClick = () => {
    if (microphoneTesterRef.current) {
      microphoneTesterRef.current.destroy();
      microphoneTesterRef.current = undefined;
    }
    if (isPlayingAudio) {
      speakerTesterRef.current?.stop();
      setIsPlayingAudio(false);
      setOutputLevel(0);
    } else {
      speakerTesterRef.current = localAudio.testSpeaker({
        speakerId: activeSpeaker,
        onAnalyseFrequency: (value) => {
          setOutputLevel(Math.min(100, value));
        }
      });
      setIsPlayingAudio(true);
    }
  };

  let microphoneBtn = 'Test Microphone';
  if (isRecordingVoice) {
    microphoneBtn = 'Recording';
  } else if (isPlayingRecording) {
    microphoneBtn = 'Playing';
  }
  useUnmount(() => {
    if (isStartedAudio) {
      localAudio.stop();
    }
    if (isStartedVideo) {
      localVideo.stop();
    }
  });
  console.log(isStartedVideo, 'isStartedVideo');
  return (
    <div className="js-preview-view">
      <div id="js-preview-view" className=" preview__root ">
        <div className=" video-app w-full ">
          <div className="px-[30px] w-full flex justify-start pt-[20px]">
            <img src="/icons/darkMode/fullLogo.svg" alt="" />
          </div>
          <div className="preview-video mt-[20px] ring-primary ring-1">
            <>
              {' '}
              <video className={classNames({ 'preview-video-show': !isInVBMode })} muted={true} ref={videoRef} />
              <canvas
                className={classNames({ 'preview-video-show': isInVBMode })}
                width="100%"
                height="100%"
                ref={canvasRef}
              />
            </>

            {!isStartedVideo && (
              <div className="absolute top-0 bottom-0 left-0 right-0 bg-[#313131] h-full z-[20] flex flex-col items-center justify-center  ">
                <div className="text-[1.5rem] text-center text-[#FFFF]">Do you want enable camera?</div>
                <button
                  className="bg-primary text-[#FFFF] px-[2rem] py-[.7rem] rounded-lg mt-[20px] text-white"
                  onClick={onCameraClick}
                >
                  Allow Camera
                </button>
              </div>
            )}
          </div>
          <div className="video-footer video-operations video-operations-preview  mt-[3rem]">
            <div className="flex gap-[1.2rem]">
              <MicrophoneButton
                isStartedAudio={isStartedAudio}
                isMuted={isMuted}
                onMicrophoneClick={onMicrophoneClick}
                onMicrophoneMenuClick={onMicrophoneMenuClick}
                microphoneList={micList}
                speakerList={speakerList}
                activeMicrophone={activeMicrophone}
                activeSpeaker={activeSpeaker}
              />
              <CameraButton
                isStartedVideo={isStartedVideo}
                onCameraClick={onCameraClick}
                onSwitchCamera={onSwitchCamera}
                onBlurBackground={onBlurBackground}
                cameraList={cameraList}
                activeCamera={activeCamera}
                isBlur={isBlur}
                isPreview={true}
              />
              <button className="h-[3.75rem] bg-[#1A71FF] rounded-[4.5rem] w-[9rem]">
                <span
                  className="text-[1rem] text-white"
                  onClick={async () => {
                    await joinSession();
                    history.push('/video');
                  }}
                >
                  Join
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewContainer;
