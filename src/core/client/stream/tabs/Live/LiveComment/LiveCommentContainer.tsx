import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { graphql } from "react-relay";

import { useToggleState } from "coral-framework/hooks";
import { useInView } from "coral-framework/lib/intersection";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ReactionButtonContainer } from "coral-stream/tabs/shared/ReactionButton";
import ReportFlowContainer, {
  ReportButton,
} from "coral-stream/tabs/shared/ReportFlow";
import { Flex, Icon, Timestamp } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";
import { LiveCommentContainer_settings } from "coral-stream/__generated__/LiveCommentContainer_settings.graphql";
import { LiveCommentContainer_viewer } from "coral-stream/__generated__/LiveCommentContainer_viewer.graphql";
import { LiveCommentReplyContainer_comment } from "coral-stream/__generated__/LiveCommentReplyContainer_comment.graphql";

import styles from "./LiveCommentContainer.css";

interface Props {
  viewer: LiveCommentContainer_viewer | null;
  comment: LiveCommentContainer_comment;
  settings: LiveCommentContainer_settings;
  onInView: (
    visible: boolean,
    id: string,
    createdAt: string,
    cursor: string
  ) => void;
  onReplyTo: (comment: LiveCommentReplyContainer_comment) => void;
}

const LiveCommentContainer: FunctionComponent<Props> = ({
  comment,
  viewer,
  settings,
  onInView,
  onReplyTo,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const { inView, intersectionRef } = useInView();

  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);

  const isViewerBanned = false;
  const isViewerSuspended = false;
  const isViewerWarned = false;

  useEffect(() => {
    if (inView) {
      onInView(inView, comment.id, comment.createdAt, comment.createdAt);
    }
  }, [comment.createdAt, comment.id, inView, onInView]);

  const onReply = useCallback(() => {
    if (!comment || !comment.revision) {
      return;
    }

    onReplyTo(comment as any);
  }, [comment, onReplyTo]);

  return (
    <div ref={rootRef} className={styles.root}>
      <div className={styles.comment} ref={intersectionRef}>
        {comment.parent && (
          <div className={styles.parent}>
            <Flex justifyContent="flex-start" alignItems="center">
              <Icon className={styles.parentArrow}>reply</Icon>
              <div className={styles.parentUser}>
                {comment.parent.author?.username}
              </div>
              <div
                className={styles.parentBody}
                dangerouslySetInnerHTML={{ __html: comment.parent?.body || "" }}
              ></div>
            </Flex>
          </div>
        )}

        <Flex justifyContent="flex-start" alignItems="flex-start">
          <div className={styles.avatar}></div>
          <div className={styles.container}>
            <Flex justifyContent="flex-start" alignItems="center">
              <div className={styles.username}>{comment.author?.username}</div>
              <Timestamp className={styles.timestamp}>
                {comment.createdAt}
              </Timestamp>
            </Flex>
            <div
              className={styles.body}
              dangerouslySetInnerHTML={{ __html: comment.body || "" }}
            ></div>
          </div>
        </Flex>

        <div id={`comment-${comment.id}`}>
          {viewer && (
            <ReactionButtonContainer
              reactedClassName=""
              comment={comment}
              settings={settings}
              viewer={viewer}
              readOnly={isViewerBanned || isViewerSuspended || isViewerWarned}
              isQA={false}
            />
          )}
          <ReportButton
            onClick={toggleShowReportFlow}
            open={showReportFlow}
            viewer={viewer}
            comment={comment}
          />
          {!comment.parent && (
            <Button
              className={styles.replyButton}
              variant="none"
              onClick={onReply}
            >
              <Icon className={styles.replyIcon}>reply</Icon>
            </Button>
          )}
        </div>
        {showReportFlow && (
          <ReportFlowContainer
            viewer={viewer}
            comment={comment}
            settings={settings}
            onClose={toggleShowReportFlow}
          />
        )}
      </div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LiveCommentContainer_viewer on User {
      id
      ...ReportFlowContainer_viewer
      ...ReportButton_viewer
      ...ReactionButtonContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveCommentContainer_comment on Comment {
      id
      revision {
        id
      }
      author {
        id
        username
      }
      body
      createdAt
      parent {
        author {
          id
          username
        }
        createdAt
        body
      }

      ...ReportButton_comment
      ...ReportFlowContainer_comment
      ...ReactionButtonContainer_comment
      ...LiveCommentReplyContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveCommentContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...ReactionButtonContainer_settings
    }
  `,
})(LiveCommentContainer);

export default enhanced;