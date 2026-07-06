import {
  acceptFriendRequest,
  cancelFriendRequest,
  declineFriendRequest,
  removeFriend,
  sendFriendRequest,
} from "@/lib/actions";
import type { FriendState } from "@/lib/queries";

export default function FriendButton({
  state,
  otherId,
}: {
  state: FriendState;
  otherId: number;
}) {
  if (state.kind === "friends") {
    return (
      <div className="flex items-center gap-3">
        <span className="pill !py-2 text-sm" data-active="true">
          ✓ Friends
        </span>
        <form action={removeFriend.bind(null, otherId)}>
          <button className="cursor-pointer text-xs text-cream-faint hover:text-ember">
            Remove
          </button>
        </form>
      </div>
    );
  }
  if (state.kind === "outgoing") {
    return (
      <div className="flex items-center gap-3">
        <span className="pill !py-2 text-sm">Request sent</span>
        <form action={cancelFriendRequest.bind(null, state.friendshipId)}>
          <button className="cursor-pointer text-xs text-cream-faint hover:text-cream">
            Cancel
          </button>
        </form>
      </div>
    );
  }
  if (state.kind === "incoming") {
    return (
      <div className="flex items-center gap-2">
        <form action={acceptFriendRequest.bind(null, state.friendshipId)}>
          <button className="pill-solid cursor-pointer !py-2 text-sm">Accept request</button>
        </form>
        <form action={declineFriendRequest.bind(null, state.friendshipId)}>
          <button className="pill cursor-pointer !py-2 text-sm">Decline</button>
        </form>
      </div>
    );
  }
  return (
    <form action={sendFriendRequest.bind(null, otherId)}>
      <button className="pill-solid cursor-pointer !py-2 text-sm">+ Add friend</button>
    </form>
  );
}
