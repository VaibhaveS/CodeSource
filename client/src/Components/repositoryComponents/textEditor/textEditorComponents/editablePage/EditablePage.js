import React, { useEffect, useState } from 'react';
import EditableBlock from '../editableBlock/EditableBlock';
import { objectId, setCaretToEnd } from '../../../../../utils';
import { usePrevious } from '../../../../../hooks';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

const EditablePage = () => {
  const [blocks, setBlocks] = useState([]);
  const [currentBlockId, setCurrentBlockId] = useState(null);

  const prevBlocks = usePrevious(blocks);

  useEffect(() => {
    fetchBlocks();
  }, []);

  // Update the database whenever blocks change
  useEffect(() => {
    const updatePageOnServer = async (blocks) => {
      try {
        // await fetch(`${process.env.NEXT_PUBLIC_API}/pages/${id}`, {
        //   method: "PUT",
        //   credentials: "include",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({
        //     blocks: blocks,
        //   }),
        // });
      } catch (err) {
        console.log(err);
      }
    };
    if (prevBlocks && prevBlocks !== blocks) {
      updatePageOnServer(blocks);
    }
  }, [blocks, prevBlocks]);

  // Handling the cursor and focus on adding and deleting blocks
  useEffect(() => {
    // If a new block was added, move the caret to it
    if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
      const nextBlockPosition = blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
      const nextBlock = document.querySelector(`[data-position="${nextBlockPosition}"]`);
      if (nextBlock) {
        nextBlock.focus();
      }
    }
    // If a block was deleted, move the caret to the end of the last block
    if (prevBlocks && prevBlocks.length - 1 === blocks.length) {
      const lastBlockPosition = prevBlocks.map((b) => b._id).indexOf(currentBlockId);
      const lastBlock = document.querySelector(`[data-position="${lastBlockPosition}"]`);
      if (lastBlock) {
        setCaretToEnd(lastBlock);
      }
    }
  }, [blocks, prevBlocks, currentBlockId]);

  const deleteImageOnServer = async (imageUrl) => {
    try {
      // const response = await fetch(
      //   `${process.env.NEXT_PUBLIC_API}/pages/${imageUrl}`,
      //   {
      //     method: "DELETE",
      //     headers: {
      //       Accept: "application/json",
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      // await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const fetchBlocks = () => {
    let fetchedBlocks = [
      {
        _id: '5f54d75b114c6d176d7e9765',
        html: 'Heading',
        tag: 'h1',
        imageUrl: '',
      },
      {
        _id: '5f54d75b114c6d176d7e9766',
        html: 'Lorem ipsum <strong>dolor sit amet consectetur</strong>, adipisicing elit. Non perferendis optio ipsum voluptates, sint, nam ullam, at nostrum ex odit eaque eius reiciendis. Exercitationem quos veritatis esse aut totam consequatur libero, ullam ipsam temporibus neque iure consequuntur quo maxime autem culpa, odit maiores repellat excepturi labore harum? Libero, quo unde?',
        tag: 'p',
        imageUrl: '',
      },
      {
        _id: '5f54d75b114c6d176d7e9767',
        html: 'Heading2',
        tag: 'h2',
        imageUrl: '',
      },
    ];
    if (fetchedBlocks.length === 0) {
      fetchedBlocks = [
        {
          _id: objectId(),
          html: '',
          tag: 'h1',
          imageUrl: '',
        },
      ];
    }
    setBlocks(fetchedBlocks);
  };

  const addBlockHandler = (currentBlock) => {
    setCurrentBlockId(currentBlock.id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: objectId(), tag: 'p', html: '', imageUrl: '' };
    updatedBlocks.splice(index + 1, 0, newBlock);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
  };

  const deleteBlockHandler = (currentBlock) => {
    if (blocks.length > 1) {
      setCurrentBlockId(currentBlock.id);
      const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
      const deletedBlock = blocks[index];
      const updatedBlocks = [...blocks];
      updatedBlocks.splice(index, 1);
      setBlocks(updatedBlocks);
      // If the deleted block was an image block, we have to delete
      // the image file on the server
      if (deletedBlock.tag === 'img' && deletedBlock.imageUrl) {
        deleteImageOnServer(deletedBlock.imageUrl);
      }
    }
  };

  const updateBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const oldBlock = blocks[index];
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
    // If the image has been changed, we have to delete the
    // old image file on the server
    if (oldBlock.imageUrl && oldBlock.imageUrl !== currentBlock.imageUrl) {
      deleteImageOnServer(oldBlock.imageUrl);
    }
  };

  const onDragEndHandler = (result) => {
    const { destination, source } = result;

    // If we don't have a destination (due to dropping outside the droppable)
    // or the destination hasn't changed, we change nothing
    if (!destination || destination.index === source.index) {
      return;
    }

    const updatedBlocks = [...blocks];
    const removedBlocks = updatedBlocks.splice(source.index - 1, 1);
    updatedBlocks.splice(destination.index - 1, 0, removedBlocks[0]);
    setBlocks(updatedBlocks);
  };

  return (
    <DragDropContext onDragEnd={onDragEndHandler}>
      <Droppable droppableId="Doc-list">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {blocks.map((block) => {
              const position = blocks.map((b) => b._id).indexOf(block._id) + 1;
              return (
                <EditableBlock
                  key={block._id}
                  position={position}
                  id={block._id}
                  tag={block.tag}
                  html={block.html}
                  imageUrl={block.imageUrl}
                  pageId={1}
                  addBlock={addBlockHandler}
                  deleteBlock={deleteBlockHandler}
                  updateBlock={updateBlockHandler}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default EditablePage;
