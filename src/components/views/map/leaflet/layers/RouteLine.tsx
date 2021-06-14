import { Box, IconButton, Tooltip, Typography } from '@material-ui/core';
import LinkIcon from '@material-ui/icons/Link';
import { makeStyles } from '@material-ui/styles';
import { LeafletEvent, LeafletEventHandlerFnMap } from 'leaflet';
import React, { FunctionComponent } from 'react';
import { Popup } from 'react-leaflet';
import TextPath from 'react-leaflet-textpath';

import { YOUTUBE_REGEX } from 'src/components/data/map/Element';
import { DEFAULT_ROUTE_COLOR, DEFAULT_ROUTE_TEXT } from 'src/components/data/map/MapRoutes';
import { f, t } from 'src/components/i18n/Localization';
import { localizeField } from 'src/components/i18n/map/FeatureLocalization';
import { NextImage } from 'src/components/interface/Image';
import YouTubeEmbed from 'src/components/interface/YouTubeEmbed';
import { EditorRoute } from 'src/components/preferences/map/EditorDataSchema';
import { SafeHTML } from 'src/components/util';
import { copyPermalink } from 'src/components/views/map/PermalinkHandler';

const POPUP_WIDTH = '560';

const useStyles = makeStyles((_theme) => ({
  popupContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& p': {
      // Improve specificity.
      margin: 0,
    },
  },
  actionContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  innerActionContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popupTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  popupContent: {
    fontSize: 12,
  },
  popupMediaImage: {
    margin: '4px 0 4px 0',
    width: 192,
    height: 192,
  },

  mapRouteLineText: {
    fontSize: 20,
  },
}));

interface RouteMediaProps {
  media: string;
  allowExternalMedia: boolean;
}

const RouteMedia: FunctionComponent<RouteMediaProps> = ({ media, allowExternalMedia }) => {
  const classes = useStyles();

  if (media == null || media === '') return null;

  const isExternal = media.match(/^http(s):\/\//);

  // An external image or link.
  if (isExternal) {
    // Is this a link to a YouTube video?
    const isYouTube = media.match(YOUTUBE_REGEX);
    if (isYouTube) {
      const match = YOUTUBE_REGEX.exec(media);
      if (match != null) {
        const videoId = match[1];
        const videoTs = parseInt(match[2] ?? '0', 10);
        if (videoId != null) {
          return <YouTubeEmbed id={videoId} width={560} height={315} start={videoTs} />;
        }
      }
    }

    // Else, it's an external image.
    if (allowExternalMedia) {
      // Display external images in the editor,
      // since it is assumed this user submitted it.
      return <img src={media} className={classes.popupMediaImage} />;
    }

    // Prevent displaying external images for security reasons.
    return <span>{media}</span>;
  }

  // Else, use an image from public/comments.
  return (
    <NextImage
      className={classes.popupMediaImage}
      src={`/images/comments/${media}.png`}
      width={192}
      height={192}
    />
  );
};

interface RouteLineProps {
  route: EditorRoute;
  editable?: boolean;
  allowExternalMedia?: boolean;
}

const RouteLine: FunctionComponent<RouteLineProps> = ({
  route,
  editable = false,
  allowExternalMedia = false,
}) => {
  // CSS classes.
  const classes = useStyles();

  const onCopyPermalink = () => copyPermalink(route.id);

  const title = localizeField(route?.popupTitle);
  const content = localizeField(route?.popupContent);

  const eventHandlers: LeafletEventHandlerFnMap = {
    add: (event: LeafletEvent) => {
      if (editable) {
        event.target.enableEdit();
      }
    },
  };

  return (
    <TextPath
      // Options passed to the parent Polyline.
      pathOptions={{
        color: route.routeColor ?? DEFAULT_ROUTE_COLOR,
      }}
      eventHandlers={eventHandlers}
      positions={route.coordinates}
      // Attributes passed to TextPath.setText.
      text={route.routeText ?? DEFAULT_ROUTE_TEXT}
      repeat
      attributes={{
        // Attributes to apply to the text.
        dy: '6',
        fill: route.routeColor ?? DEFAULT_ROUTE_COLOR,
        class: classes.mapRouteLineText,
      }}
    >
      {/* A modern variant of MapPopupLegacy. */}
      <Popup maxWidth={540} minWidth={192} autoPan={false} keepInView={false}>
        <Box className={classes.popupContainer}>
          {title && title !== '' ? (
            <Typography className={classes.popupTitle}>{title}</Typography>
          ) : (
            <Typography className={classes.popupTitle}>
              {f('map-ui:route-id-format', { id: route.id.slice(0, 7) })}
            </Typography>
          )}
          <Box>
            <RouteMedia media={route.popupMedia ?? ''} allowExternalMedia={allowExternalMedia} />
          </Box>
          {content && content !== '' ? (
            <SafeHTML className={classes.popupContent}>{content}</SafeHTML>
          ) : null}
          {!editable ? (
            <Box className={classes.actionContainer}>
              <Tooltip title={t('map-ui:copy-permalink')}>
                <Box className={classes.innerActionContainer}>
                  <IconButton onClick={onCopyPermalink}>
                    <LinkIcon />
                  </IconButton>
                </Box>
              </Tooltip>
            </Box>
          ) : null}
        </Box>
      </Popup>
    </TextPath>
  );
};

export default RouteLine;
