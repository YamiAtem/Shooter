AFRAME.registerComponent('bullet', {


    init: function () {
        this.shoot_bullet()
    },

    shoot_bullet: function () {
        window.addEventListener("keydown", event => {
            if (event.key === "e") {
                var bullet = document.createElement("a-entity")

                bullet.setAttribute("geometry", {
                    primitive: "sphere",
                    radius: 0.1
                })
                bullet.setAttribute("material", "color", "black")

                var cam = document.querySelector("#camera")
                pos = cam.getAttribute("position")

                bullet.setAttribute("position", {
                    x: pos.x,
                    y: pos.y,
                    z: pos.z
                })

                var camera = document.querySelector("#camera").object3D;

                var direction = new THREE.Vector3();
                camera.getWorldDirection(direction)

                bullet.setAttribute("velocity", direction.multiplyScalar(-75))

                var scene = document.querySelector("#scene")

                bullet.setAttribute("dynamic-body", {
                    shape: "sphere",
                    mass: 0
                });

                bullet.addEventListener("collide", this.remove_bullet)
                
                scene.appendChild(bullet)
            }
        });
    },

    remove_bullet: function (e) {
        //original entity
        console.log(e.detail.target.el)

        //other entities which the bullet is touching
        console.log(e.detail.body.el)

        var element = e.detail.target.el
        var element_hit = e.detail.body.el

        if (element_hit.id.includes("box")) {
            element_hit.setAttribute("material", {
                opacity: 1,
                transparent: true
            })
        }

        var impulse = new CANNON.Vec3(-2, 2, 1)
        var world_point = new CANNON.Vec3().copy(element_hit.getAttribute("position"))

        element_hit.body.applyImpulse(impulse, world_point)

        element.removeEventListener("collide", this.shoot_bullet)

        var scene = document.querySelector("#scene")
        scene.removeChild(element)
    }
})
